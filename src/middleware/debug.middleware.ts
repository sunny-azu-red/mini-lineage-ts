import { Request, Response, NextFunction } from 'express';
import { GAME_VERSION } from '@/constant/game.constant';
import { isRelease } from '@/util/version';
import { logger } from '@/config/logger.config';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        if (isRelease(GAME_VERSION))
            return;

        const duration = Date.now() - start;
        const message = `[${req.method}] ${req.url} = ${res.statusCode} (${duration}ms) ${req.sessionID}`;

        let logData = {};
        if (req.session) {
            const state = { ...req.session };
            delete (state as any).cookie;

            if (state && Object.keys(state).length > 0) {
                const { name, ...rest } = state as any;
                logData = { "name\u200B": name, ...rest };
            }
        }

        logger.debug(logData, message);
    });

    next();
};
