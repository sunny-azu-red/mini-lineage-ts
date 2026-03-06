import { Request, Response, NextFunction } from 'express';
import { calculateLevel } from '@/service/math.service';
import { renderSuicideView, renderDeathView, renderXpTableView } from '@/view/player.view';
import { commitSuicide } from '@/service/player.service';
import { SuicideSchema } from '@/schema/player.schema';

export const getSuicide = (req: Request, res: Response) => {
    res.send(renderSuicideView(res.locals.player, res.locals.flash));
};

export const postSuicide = (req: Request, res: Response, next: NextFunction) => {
    const parsed = SuicideSchema.safeParse(req.body);
    if (!parsed.success)
        return next(new Error('Invalid suicide selection'));

    if (parsed.data.suicide === 'yes') {
        commitSuicide(res.locals.player);
        return res.redirect('/death');
    }

    res.redirect('/');
};

export const getDeath = (req: Request, res: Response) => {
    res.send(renderDeathView(res.locals.player));
};

export const getRestart = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export const getXpTable = (req: Request, res: Response) => {
    const player = res.locals.player;
    const currentXp = player.experience;
    const currentLevel = calculateLevel(currentXp);

    res.send(renderXpTableView(currentXp, currentLevel, res.locals.flash));
};
