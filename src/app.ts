import express from 'express';
import path from 'path';
import session from 'express-session';
import { cheatMiddleware } from '@/middleware/cheat.middleware';
import { flashMiddleware } from '@/middleware/flash.middleware';
import { debugMiddleware } from '@/middleware/debug.middleware';
import { env } from '@/config/env.config';
import router from '@/route';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(debugMiddleware);
app.use(flashMiddleware);
app.use(cheatMiddleware);
app.use('/', router);

export default app;
