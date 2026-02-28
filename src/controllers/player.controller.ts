import { Request, Response } from 'express';
import { calculateLevel } from '../services/math.service';
import { renderSuicideView, renderDeathView, renderExpTableView } from '../views/player.view';

export const getSuicide = (req: Request, res: Response) => {
    res.send(renderSuicideView(res.locals.player, res.locals.flash));
};

export const postSuicide = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (req.body.suicide === 'yes') {
        player.dead = true;
        player.coward = true;
        res.redirect('/death');
    } else {
        res.redirect('/');
    }
};

export const getDeath = (req: Request, res: Response) => {
    const player = res.locals.player;
    const reason = player.coward
        ? "🤡 You took the cowardly way out."
        : player.ambushed
            ? "🪤 You were caught trying to flee an ambush! Game Over."
            : "☠️ Your health dropped to 0 and you died.";

    res.send(renderDeathView(reason, !!(player.coward || player.ambushed)));
};

export const getRestart = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export const getExpTable = (req: Request, res: Response) => {
    const player = res.locals.player;
    const currentExp = player.experience || 0;
    const currentLevel = calculateLevel(currentExp);

    res.send(renderExpTableView(currentExp, currentLevel, res.locals.flash));
};
