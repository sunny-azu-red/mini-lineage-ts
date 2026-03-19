import { Request, Response } from 'express';
import { randomInt } from '@/service/math.service';
import { renderBattlegroundView } from '@/view/battle.view';
import { simulateBattle } from '@/service/battle.service';
import { applyBattleResult } from '@/service/player.service';
import { RACES } from '@/constant/game.constant';

import { gameStatsRepository } from '@/repository/game-stats.repository';

export const getBattle = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (player.ambushed)
        player.ambushed = false;

    const results = simulateBattle(player.weaponId, player.armorId);
    const levelUpFlash = applyBattleResult(player, results.hpLost, results.xpGained, results.adenaGained, results.enemiesKilled);
    if (player.dead)
        return res.redirect('/death');

    const race = RACES[player.raceId];
    let isAmbushed = randomInt(1, race.ambushOdds) === 1;
    if (isAmbushed) {
        player.ambushed = true;
        player.totalAmbushes = (player.totalAmbushes ?? 0) + 1;
        void gameStatsRepository.increment('total_ambushes');
    }

    const flashToRender = levelUpFlash || res.locals.flash;
    res.send(renderBattlegroundView(player, results, flashToRender));
};
