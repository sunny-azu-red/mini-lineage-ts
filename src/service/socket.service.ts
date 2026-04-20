import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { RequestHandler } from 'express';
import { sessionStore } from '@/config/database.config';
import { TICK_CONFIG, RACES } from '@/constant/game.constant';
import { processTick, isGameStarted } from '@/service/player.service';
import { PlayerState } from '@/interface';

const socketZones = new Map<string, string>(); // map each socket to its current route so we can filter by zone
const socketSessions = new Map<string, string>(); // map each socket to its session ID so we can load and save the session

let io: SocketIOServer;

export function initSocketService(server: HttpServer, sessionMiddleware: RequestHandler): void {
    io = new SocketIOServer(server, {
        cors: { origin: false }, // restrict to same origin; can be loosened if needed
    });

    // share the Express session with Socket.IO so we read/write the same session store
    io.use((socket, next) => {
        (sessionMiddleware as any)(socket.request, {}, next);
    });

    io.on('connection', (socket: Socket) => {
        const req = socket.request as any;
        const sessionId: string | undefined = req.session?.id;

        if (sessionId)
            socketSessions.set(socket.id, sessionId);

        // client emits its current pathname on every page load/navigation
        socket.on('zone', (path: string) => {
            socketZones.set(socket.id, path);
        });

        socket.on('disconnect', () => {
            socketZones.delete(socket.id);
            socketSessions.delete(socket.id);
        });
    });

    // global tick — runs every TICK_CONFIG.intervalMs on the server
    setInterval(() => {
        socketZones.forEach((zone, socketId) => {
            // only tick resting zones
            if (!(TICK_CONFIG.restingZones as readonly string[]).includes(zone)) return;

            const sessionId = socketSessions.get(socketId);
            if (!sessionId)
                return;

            // load the session from the store, apply regen, save it back, emit update
            sessionStore.get(sessionId, (err, session) => {
                if (err || !session)
                    return;

                const player = session as unknown as PlayerState;
                if (!isGameStarted(player))
                    return;

                const changed = processTick(player);
                if (!changed)
                    return;

                // persist the updated session
                sessionStore.set(sessionId, session, (saveErr) => {
                    if (saveErr)
                        return;

                    const targetSocket = io.sockets.sockets.get(socketId);
                    if (!targetSocket)
                        return;

                    // emit the new HP to the specific client
                    targetSocket.emit('player_update', {
                        health: player.health,
                        maxHealth: player.raceId !== undefined ? RACES[player.raceId].startHealth : null,
                    });
                });
            });
        });
    }, TICK_CONFIG.intervalMs);
}
