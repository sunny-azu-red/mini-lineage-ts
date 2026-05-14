import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { RequestHandler } from 'express';
import { sessionStore } from '@/config/database.config';
import { acquireSessionLock } from '@/util/lock.util';
import { TICK_CONFIG, RACES } from '@/constant/game.constant';
import { processTick, isGameStarted, getPlayerAuras } from '@/service/player.service';
import { PlayerState } from '@/interface';
import { logger } from '@/config/logger.config';
import { z } from 'zod';
import { SocketPingEventSchema } from '@/schema/socket.schema';

const GRACE_PERIOD_MS = 10_000;
const sessionTracker = new Map<string, { socketIds: Set<string>, lastSeen: number }>();

let io: SocketIOServer;

/**
 * Builds the standardized player_update payload sent to connected clients.
 */
function buildPlayerUpdate(player: PlayerState) {
    return {
        health: player.health,
        maxHealth: player.raceId !== undefined ? RACES[player.raceId].startHealth : null,
        auras: getPlayerAuras(player),
    };
}

/**
 * Emits a player_update event to all sockets tracked under a given session.
 */
function emitToSession(tracker: { socketIds: Set<string> }, player: PlayerState) {
    const payload = buildPlayerUpdate(player);

    tracker.socketIds.forEach(socketId => {
        const targetSocket = io.sockets.sockets.get(socketId);
        if (targetSocket)
            targetSocket.emit('player_update', payload);
    });
}

/**
 * Processes a single session's tick: loads the session, applies passive effects,
 * persists changes, and emits updates to connected clients.
 */
function processSessionTick(tracker: { socketIds: Set<string> }, sessionId: string) {
    acquireSessionLock(sessionId).then((release) => {
        sessionStore.get(sessionId, (err, session) => {
            if (err || !session) {
                release();
                return;
            }

            const player = session as unknown as PlayerState;
            if (!isGameStarted(player)) {
                release();
                return;
            }

            logger.debug(`[TICK] ${player.name} "${sessionId}"`);

            // only tick if the player is in a resting state (set by zoneMiddleware)
            if (!player.isResting) {
                release();
                return;
            }

            // apply regeneration logic
            const oldHp = player.health;
            const changed = processTick(player);
            if (!changed) {
                release();
                return;
            }

            logger.debug(`[REGEN] ${player.name} | HPR: +${player.health - oldHp} | HP: ${oldHp} -> ${player.health}`);

            // persist the updated session and notify all connected clients
            sessionStore.set(sessionId, session, (saveErr) => {
                release();
                if (saveErr)
                    return;

                emitToSession(tracker, player);
            });
        });
    });
}

export function initSocketService(server: HttpServer, sessionMiddleware: RequestHandler): void {
    io = new SocketIOServer(server, {
        cors: { origin: false },
    });

    io.use((socket, next) => {
        (sessionMiddleware as any)(socket.request, {}, next);
    });

    /**
     * Helper to securely register socket events with Zod validation.
     * Prevents malicious clients from bypassing HTTP validation by sending fake WebSocket events.
     */
    function registerSecureEvent<T>(
        socket: Socket,
        eventName: string,
        schema: z.ZodType<T>,
        handler: (data: T, sessionId: string) => void
    ) {
        socket.on(eventName, (payload) => {
            const parsed = schema.safeParse(payload);
            if (!parsed.success) {
                logger.warn({ err: parsed.error }, `[SOCKET] Invalid payload for event '${eventName}' from socket ${socket.id}`);
                return;
            }

            const req = socket.request as any;
            const sessionId: string | undefined = req.session?.id;

            if (!sessionId) {
                logger.warn(`[SOCKET] Unauthenticated event '${eventName}' from socket ${socket.id}`);
                return;
            }

            handler(parsed.data, sessionId);
        });
    }

    io.on('connection', (socket: Socket) => {
        const req = socket.request as any;
        const sessionId: string | undefined = req.session?.id;

        // sync state and track this socket for this session ID
        if (sessionId) {
            // initial update to sync state after page load (prevents stale UI)
            sessionStore.get(sessionId, (err, session) => {
                if (err || !session) return;
                const player = session as PlayerState;
                socket.emit('player_update', buildPlayerUpdate(player));
            });

            // tracker logic
            let tracker = sessionTracker.get(sessionId);
            if (!tracker) {
                tracker = { socketIds: new Set(), lastSeen: Date.now() };
                sessionTracker.set(sessionId, tracker);
            }

            tracker.socketIds.add(socket.id);
            tracker.lastSeen = Date.now();
        }

        socket.on('disconnect', () => {
            if (sessionId) {
                const tracker = sessionTracker.get(sessionId);
                if (tracker) {
                    tracker.socketIds.delete(socket.id);
                    tracker.lastSeen = Date.now();
                }
            }
        });

        // example of a secure event listener
        registerSecureEvent(socket, 'ping', SocketPingEventSchema, (data, sid) => {
            logger.debug(`[SOCKET] Ping received from ${sid} with timestamp ${data.timestamp}`);
            socket.emit('pong', { timestamp: data.timestamp });
        });
    });

    // global tick — runs every TICK_CONFIG.intervalMs on the server
    setInterval(() => {
        const now = Date.now();

        sessionTracker.forEach((tracker, sessionId) => {
            // clean up stale sessions (no sockets and beyond grace period)
            if (tracker.socketIds.size === 0 && now - tracker.lastSeen > GRACE_PERIOD_MS) {
                logger.debug(`[SOCKET] Cleaning up stale "${sessionId}"`);
                sessionTracker.delete(sessionId);
                return;
            }

            processSessionTick(tracker, sessionId);
        });
    }, TICK_CONFIG.intervalMs);
}
