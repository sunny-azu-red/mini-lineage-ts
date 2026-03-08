import { Request, Response } from 'express';
import { randomInt } from '@/service/math.service';
import { renderBattlegroundView } from '@/view/battle.view';
import { simulateBattle } from '@/service/battle.service';
import { applyBattleResult, attemptEscape } from '@/service/player.service';
import { RACES } from '@/constant/game.constant';
import { makeFlash } from '@/util';
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
        void gameStatsRepository.increment('total_ambushes');
    }

    const flashToRender = levelUpFlash || res.locals.flash;
    res.send(renderBattlegroundView(player, results, flashToRender));
};

export const postEscape = (req: Request, res: Response) => {
    const player = res.locals.player;
    if (!player.ambushed)
        return res.redirect('/');

    const escaped = attemptEscape(player);

    if (player.health <= 0) {
        player.dead = true;
        return res.redirect('/death');
    }

    if (escaped) {
        player.flash = makeFlash('You slipped away into the shadows.', 'success');
        return res.redirect('/');
    }

    player.flash = makeFlash('You failed to escape and took damage!', 'danger');
    return res.redirect('/battle');
};
