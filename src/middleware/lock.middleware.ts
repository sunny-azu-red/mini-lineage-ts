import { Request, Response, NextFunction } from 'express';
import { acquireSessionLock } from '@/util/lock.util';
import { PlayerState } from '@/interface';

/**
 * lockMiddleware — acquires a per-session mutex so that concurrent
 * requests (double-clicks, rapid refreshes, WebSocket tick collisions) are
 * serialized. After acquiring the lock it reloads the session from the store
 * to guarantee the handler works on the latest data.
 */
export const lockMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.session?.id;
    if (!sessionId)
        return next();

    return acquireSessionLock(sessionId).then((release) => {
        // release the lock when the response is finished (success or error)
        res.on('finish', release);

        // reload the session from the store to get the absolute latest data
        req.session.reload((err) => {
            if (err) {
                release(); // Ensure lock is released if reload fails
                return next(err);
            }

            res.locals.player = req.session as PlayerState;
            next();
        });
    }).catch((err) => {
        next(err);
    });
};
