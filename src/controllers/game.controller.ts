import { Request, Response } from 'express';
import { PlayerState } from '../common/types';
import { isGameStarted } from '../common/utils';
import { renderGameStartView, renderHomeView } from '../views/game.views';
import { Race } from '../common/types';
import { HEROES } from '../common/data';
import { initializePlayer } from '../services/player.service';

export const getHome = (req: Request, res: Response) => {
    if (!isGameStarted(req))
        return res.send(renderGameStartView());

    const player = req.session as PlayerState;
    if (player.ambushed)
        return res.redirect('/battle');

    const isNewPlayer = !player.welcomed;
    if (isNewPlayer)
        player.welcomed = true;

    const html = renderHomeView(player, isNewPlayer);
    res.send(html);
};

export const getHuman = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    initializePlayer(player, HEROES[Race.Human]);
    res.redirect('/');
};

export const getOrc = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    initializePlayer(player, HEROES[Race.Orc]);
    res.redirect('/');
};
