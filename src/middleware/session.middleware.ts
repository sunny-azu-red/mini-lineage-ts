import session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { env } from '@/config/env.config';
import { sessionStore } from '@/config/database.config';
import { PlayerState } from '@/interface';

const expressSession = session({
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

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    expressSession(req, res, (err) => {
        if (err)
            return next(err);

        if (res && res.locals) // safe check for res.locals (Socket.IO passes a mock response object {} which lacks locals)
            res.locals.player = req.session as PlayerState;

        next();
    });
};

/**
 * Saves the session to the store before redirecting.
 * Always use this instead of res.redirect() in POST handlers that mutate session
 * state, to prevent a race condition where the browser follows the redirect before
 * the session store has finished persisting the updated data.
 */
export const saveAndRedirect = (req: Request, res: Response, next: NextFunction, url: string) => {
    req.session.save((err) => {
        if (err)
            return next(err);

        res.redirect(url);
    });
};
