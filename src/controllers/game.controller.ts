import { Request, Response } from 'express';
import { PlayerState } from '../common/types';
import { isGameStarted } from '../common/utils';
import { renderGameStartView, renderHomeView } from '../views/game.view';
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

export const postGameStart = (req: Request, res: Response) => {
    const heroId = parseInt(req.body.select_hero);
    const hero = HEROES[heroId];
    if (!hero)
        return res.redirect('/');

    const player = req.session as PlayerState;
    initializePlayer(player, hero);
    res.redirect('/');
};
