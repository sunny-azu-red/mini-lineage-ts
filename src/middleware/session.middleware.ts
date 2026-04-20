import session from 'express-session';
import { env } from '@/config/env.config';
import { sessionStore } from '@/config/database.config';

export const sessionMiddleware = session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        sameSite: 'lax',
        httpOnly: true,
        secure: env.IN_DOCKER,
    },
});
