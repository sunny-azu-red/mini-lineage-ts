import { Request, Response } from 'express';
import { PlayerState } from '../common/types';
import { calculateLevel } from '../services/math.service';
import { renderSuicideView, renderDeathView, renderExpTableView } from '../views/player.views';

export const getSuicide = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    res.send(renderSuicideView(player));
};

export const postSuicide = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    if (req.body.suicide === 'yes') {
        player.dead = true;
        player.coward = true;
        res.redirect('/death');
    } else {
        res.redirect('/');
    }
};

export const getDeath = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    const reason = player.coward
        ? "🤡 You took the cowardly way out."
        : player.cheater
            ? "🪤 You were caught trying to flee an ambush! Game Over."
            : "☠️ Your health dropped to 0 and you died.";

    res.send(renderDeathView(reason, !!(player.coward || player.cheater)));
};

export const getRestart = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export const getExpTable = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    const currentExp = player.experience || 0;
    const currentLevel = calculateLevel(currentExp);

    res.send(renderExpTableView(currentExp, currentLevel));
};
