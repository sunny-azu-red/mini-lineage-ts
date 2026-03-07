import { Request, Response, NextFunction } from 'express';
import { renderGameStartView, renderHomeView } from '@/view/game.view';
import { initializePlayer, isGameStarted } from '@/service/player.service';
import { makeFlash } from '@/util';
import { RACES } from '@/constant/game.constant';
import { GameStartSchema } from '@/schema/shop.schema';

export const getHome = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (!isGameStarted(player))
        return res.send(renderGameStartView());

    if (player.ambushed)
        return res.redirect('/battle');

    res.send(renderHomeView(player, res.locals.flash));
};

export const postGameStart = (req: Request, res: Response, next: NextFunction) => {
    const parsed = GameStartSchema.safeParse(req.body);
    if (!parsed.success)
        return next(new Error('Invalid race selection'));

    const race = RACES[parsed.data.select_race];
    const player = res.locals.player;
    const flash = initializePlayer(player, race);
    player.flash = makeFlash(flash.text, flash.type);

    res.redirect('/');
};
