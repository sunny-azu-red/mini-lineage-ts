import { Request, Response } from 'express';
import { isGameStarted } from '../common/utils';
import { renderGameStartView, renderHomeView } from '../views/game.view';
import { HEROES } from '../common/data';
import { initializePlayer } from '../services/player.service';

export const getHome = (req: Request, res: Response) => {
    if (!isGameStarted(req))
        return res.send(renderGameStartView());

    const player = res.locals.player;
    if (player.ambushed)
        return res.redirect('/battle');

    res.send(renderHomeView(player, res.locals.flash));
};

export const postGameStart = (req: Request, res: Response) => {
    const heroId = parseInt(req.body.select_hero);
    const hero = HEROES[heroId];
    if (!hero)
        return res.redirect('/');

    const player = res.locals.player;
    player.flash = initializePlayer(player, hero);

    res.redirect('/');
};
