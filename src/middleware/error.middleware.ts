import { NextFunction, Request, Response } from 'express';
import { readTemplate, render } from '@/view/base.view';
import { renderSimplePage } from '@/view/layout.view';
import { isRelease } from '@/util/version.util';
import { GAME_VERSION } from '@/constant/game.constant';
import { logger } from '@/config/logger.config';

const errorTpl = readTemplate('error.ejs');

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err }, '🔥 System Error');

    const detail = !isRelease(GAME_VERSION) ? (err?.message ?? String(err)) : null;
    const content = render(errorTpl, { detail });

    const status = err.status || 500;
    res.status(status).send(renderSimplePage('Something went wrong', content, null, res.locals.player));
};
