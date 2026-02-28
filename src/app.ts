import express from 'express';
import path from 'path';
import session from 'express-session';
import { cheatMiddleware } from './middlewares/cheat.middleware';
import { flashMiddleware } from './middlewares/flash.middleware';
import router from './routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(flashMiddleware);
app.use(cheatMiddleware);
app.use('/', router);

export default app;
