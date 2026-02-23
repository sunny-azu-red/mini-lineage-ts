import { Request, Response } from 'express';
import { PlayerState } from '../common/types';
import { isGameStarted } from '../common/utils';
import { renderSimplePage } from '../views/layout';
import { renderGameStartView, renderHomeView } from '../views/game.views';
import { Race } from '../common/types';

export const getHome = (req: Request, res: Response) => {
    if (!isGameStarted(req))
        return res.send(renderGameStartView());

    const player = req.session as PlayerState;
    if (player.caught)
        return res.redirect('/battle');

    const isNewPlayer = !player.welcomed;
    if (isNewPlayer)
        player.welcomed = true;

    const html = renderHomeView(player, isNewPlayer);
    res.send(html);
};

export const getHuman = (req: Request, res: Response) => {
    const player = req.session as PlayerState;

    player.race = Race.Human;
    player.health = 100;
    player.adena = 300;
    player.experience = 0;
    player.weaponId = 0;
    player.armorId = 0;
    player.welcomed = false;

    res.redirect('/');
};

export const getOrc = (req: Request, res: Response) => {
    res.send(renderSimplePage('Hmmm', `
        Module not yet finished 🥹<br><br>
        <a href="/">Go back</a>
    `));
};
