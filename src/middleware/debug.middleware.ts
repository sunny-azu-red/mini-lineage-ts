import { Request, Response, NextFunction } from 'express';
import { GAME_VERSION } from '@/constant/game.constant';
import { isRelease } from '@/util';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        if (isRelease(GAME_VERSION))
            return;

        const duration = Date.now() - start;
        console.log(`\n[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);

        if (req.session) {
            const state = { ...req.session };
            delete (state as any).cookie;

            console.dir({ '📦 Player State:': state }, { colors: true, depth: null });
        }
    });

    next();
};
