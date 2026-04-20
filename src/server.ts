import 'dotenv/config';
import http from 'http';
import { env } from '@/config/env.config';
import { GAME_VERSION } from '@/constant/game.constant';
import app, { sessionMiddleware } from './app';
import { initSocketService } from '@/service/socket.service';

const server = http.createServer(app);

initSocketService(server, sessionMiddleware);

server.listen(env.PORT, () => {
    console.log(`${GAME_VERSION} | Mini-Lineage remastered running on port ${env.PORT}!`);
});
