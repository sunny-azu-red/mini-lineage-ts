import { Request, Response } from 'express';
import { isGameStarted, formatAdena, randomInt } from '../common/utils';
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
    initializePlayer(player, hero);

    const builds = ['a slim', 'a lean', 'an average', 'a fit', 'a stocky', 'a broad', 'a round'];
    const build = builds[randomInt(0, builds.length - 1)];
    const age = randomInt(9, 69);

    let definition = 'youth';
    if (age > 23 && age <= 54) {
        definition = 'adult';
    } else if (age > 54) {
        definition = 'elder';
    }

    const message = `You have selected to be ${hero.emoji} ${hero.label}. Congratulations!<br>You are ${build} ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} adena.`;
    player.flash = { text: message, type: 'info' };

    res.redirect('/');
};
