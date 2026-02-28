import { Request, Response } from 'express';
import { renderGameStartView, renderHomeView } from '../views/game.view';
import { HEROES } from '../common/data';
import { initializePlayer, isGameStarted } from '../services/player.service';

export const getHome = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (!isGameStarted(player))
        return res.send(renderGameStartView());

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
