import { NextFunction, Request, Response } from 'express';
import { readTemplate, render } from '@/view/base.view';
import { renderSimplePage } from '@/view/layout.view';
import { isRelease } from '@/util';
import { GAME_VERSION } from '@/constant/game.constant';

const errorTpl = readTemplate('error.ejs');

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('\n🔥 System Error:', err?.stack ?? err);

    const detail = !isRelease(GAME_VERSION) ? (err?.message ?? String(err)) : null;
    const content = render(errorTpl, { detail });

    res.status(500).send(renderSimplePage('Something went wrong', content));
};
