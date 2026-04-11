import express from 'express';
import path from 'path';
import session from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
import { cheatMiddleware } from '@/middleware/cheat.middleware';
import { flashMiddleware } from '@/middleware/flash.middleware';
import { debugMiddleware } from '@/middleware/debug.middleware';
import { errorMiddleware } from '@/middleware/error.middleware';
import { env } from '@/config/env.config';
import { sessionStore } from '@/config/database.config';
import { GAME_VERSION } from '@/constant/game.constant';
import { isRelease } from '@/util/version';
import router from '@/route';

const app = express();
const staticPath = isRelease(GAME_VERSION)
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '../public');

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        sameSite: 'strict',
        httpOnly: true,
    },
}));
app.use(debugMiddleware);
app.use(flashMiddleware);
app.use(cheatMiddleware);
app.use('/', router);
app.use(errorMiddleware);

export default app;
