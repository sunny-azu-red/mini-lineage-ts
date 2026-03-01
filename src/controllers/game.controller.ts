import { Request, Response } from 'express';
import { renderGameStartView, renderHomeView } from '../views/game.view';
import { RACES } from '../common/data';
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
    const raceId = parseInt(req.body.select_race);
    const race = RACES[raceId];
    if (!race)
        return res.redirect('/');

    const player = res.locals.player;
    player.flash = initializePlayer(player, race);

    res.redirect('/');
};
