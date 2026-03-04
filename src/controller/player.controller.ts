import { Request, Response } from 'express';
import { calculateLevel } from '@/service/math.service';
import { renderSuicideView, renderDeathView, renderExpTableView } from '@/view/player.view';
import { commitSuicide } from '@/service/player.service';

export const getSuicide = (req: Request, res: Response) => {
    res.send(renderSuicideView(res.locals.player, res.locals.flash));
};

export const postSuicide = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (req.body.suicide === 'yes') {
        commitSuicide(player);
        res.redirect('/death');
    } else {
        res.redirect('/');
    }
};

export const getDeath = (req: Request, res: Response) => {
    res.send(renderDeathView(res.locals.player));
};

export const getRestart = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export const getExpTable = (req: Request, res: Response) => {
    const player = res.locals.player;
    const currentExp = player.experience;
    const currentLevel = calculateLevel(currentExp);

    res.send(renderExpTableView(currentExp, currentLevel, res.locals.flash));
};
