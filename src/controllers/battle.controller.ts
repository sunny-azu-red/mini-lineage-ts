import { Request, Response } from 'express';
import { randomInt } from '../common/utils';
import { renderBattlegroundView } from '../views/battle.view';
import { simulateBattle } from '../services/battle.service';
import { applyBattleResult } from '../services/player.service';
import { HEROES } from '../common/data';

export const getBattle = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (player.ambushed)
        player.ambushed = false;

    const results = simulateBattle(player.weaponId, player.armorId);
    const levelUpFlash = applyBattleResult(player, results.hpLost, results.expGained, results.adenaGained);
    if (player.dead)
        return res.redirect('/death');

    const hero = HEROES[player.heroId];
    let isAmbushed = randomInt(1, hero.ambushOdds) === 1;
    if (isAmbushed)
        player.ambushed = true;

    const flashToRender = levelUpFlash || res.locals.flash;
    res.send(renderBattlegroundView(player, results, flashToRender));
};
