import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { RequestHandler } from 'express';
import { sessionStore } from '@/config/database.config';
import { TICK_CONFIG, RACES } from '@/constant/game.constant';
import { processTick, isGameStarted } from '@/service/player.service';
import { PlayerState } from '@/interface';
import { logger } from '@/config/logger.config';

const GRACE_PERIOD_MS = 10_000;
const sessionTracker = new Map<string, { socketIds: Set<string>, lastSeen: number }>();

let io: SocketIOServer;

export function initSocketService(server: HttpServer, sessionMiddleware: RequestHandler): void {
    io = new SocketIOServer(server, {
        cors: { origin: false },
    });

    io.use((socket, next) => {
        (sessionMiddleware as any)(socket.request, {}, next);
    });

    io.on('connection', (socket: Socket) => {
        const req = socket.request as any;
        const sessionId: string | undefined = req.session?.id;

        if (sessionId) {
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

            // load session from store to get latest player state and flags
            sessionStore.get(sessionId, (err, session) => {
                if (err || !session)
                    return;

                const player = session as unknown as PlayerState;
                if (!isGameStarted(player))
                    return;

                logger.debug(`[TICK] ${player.name} "${sessionId}"`);

                // only tick if the player is in a resting state (set by zoneMiddleware)
                if (!player.isResting)
                    return;

                // apply regeneration logic
                const oldHp = player.health;
                const changed = processTick(player);
                if (!changed)
                    return;

                logger.debug(`[REGEN] ${player.name} | HPR: +${player.health - oldHp} | HP: ${oldHp} -> ${player.health}`);

                // persist the updated session and notify all connected clients
                sessionStore.set(sessionId, session, (saveErr) => {
                    if (saveErr)
                        return;

                    tracker.socketIds.forEach(socketId => {
                        const targetSocket = io.sockets.sockets.get(socketId);
                        if (targetSocket) {
                            targetSocket.emit('player_update', {
                                health: player.health,
                                maxHealth: player.raceId !== undefined ? RACES[player.raceId].startHealth : null,
                            });
                        }
                    });
                });
            });
        });
    }, TICK_CONFIG.intervalMs);
}
