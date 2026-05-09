import { Request, Response, NextFunction } from 'express';
import { calculateLevel, calculateAmbushChance } from '@/service/math.service';
import { formatNumber } from '@/util/format.util';
import { makeFlash } from '@/util/game.util';
import { renderBattlegroundView } from '@/view/battle.view';
import { simulateBattle } from '@/service/battle.service';
import { resolveBattleOutcome } from '@/service/player.service';
import { RACES } from '@/constant/game.constant';
import { statisticsRepository } from '@/repository/statistics.repository';
import { saveAndRedirect } from '@/middleware/session.middleware';

export const getBattle = (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;
    if (player.ambushed)
        player.ambushed = false;

    const results = simulateBattle(player.raceId, player.weaponId, player.armorId);
    results.isLevelUp = resolveBattleOutcome(player, results.hpLost, results.xpGained, results.adenaGained, results.enemiesKilled, results.damageBlocked, results.isCritical);
    if (player.dead)
        return saveAndRedirect(req, res, next, '/death');

    const race = RACES[player.raceId];
    let isAmbushed = calculateAmbushChance(race.ambushChance);
    if (isAmbushed) {
        player.ambushed = true;
        player.totalAmbushes = (player.totalAmbushes ?? 0) + 1;
        void statisticsRepository.increment('total_ambushes');
    }

    const flash = results.isLevelUp
        ? makeFlash(`🎉 Congratulations! You have reached level ${formatNumber(calculateLevel(player.experience))}.`, 'warning')
        : res.locals.flash;

    res.send(renderBattlegroundView(player, results, flash));
};
