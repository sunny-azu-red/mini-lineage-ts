import express from 'express';
import path from 'path';
import session from 'express-session';
import { antiCheatMiddleware } from './middlewares/antiCheat';
import router from './routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/style', express.static(path.join(__dirname, '../style')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(antiCheatMiddleware);
app.use('/', router);

export default app;
