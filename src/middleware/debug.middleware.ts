import { Request, Response, NextFunction } from 'express';
import { GAME_VERSION } from '@/constant/game.constant';
import { isRelease } from '@/util';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        if (isRelease(GAME_VERSION))
            return;

        const duration = Date.now() - start;
        console.log(`\n[${req.method}] \x1b[96m${req.url}\x1b[0m = ${res.statusCode} \x1b[90m(${duration}ms)\x1b[0m \x1b[95m${req.sessionID}\x1b[0m`);

        if (req.session) {
            const state = { ...req.session };
            delete (state as any).cookie;

            if (state && Object.keys(state).length > 0)
                console.dir(state, { colors: true, depth: null });
        }
    });

    next();
};
