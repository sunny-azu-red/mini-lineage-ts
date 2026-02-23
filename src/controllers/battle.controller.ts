import { Request, Response } from 'express';
import { PlayerState } from '../common/types';
import { calculateLevel } from '../services/math.service';
import { randomInt } from '../common/utils';
import { renderBattlegroundView } from '../views/battle.views';
import { simulateBattle } from '../services/battle.service';
import { applyBattleResult } from '../services/player.service';

export const getBattle = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    if (player.caught)
        player.caught = false;

    const level = calculateLevel(player.experience);
    const results = simulateBattle(player.weaponId, player.armorId, player.experience);

    applyBattleResult(player, results.hpLost, results.expGained, results.adenaGained);

    if (player.health <= 0) {
        player.dead = true;
        return res.redirect('/death');
    }

    const newLevel = calculateLevel(player.experience);
    let leveledUp = newLevel > level;
    if (leveledUp)
        player.health = 100;

    const luck = randomInt(1, 5);
    let isAmbushed = luck === 15;
    if (isAmbushed)
        player.caught = true;

    res.send(renderBattlegroundView(player, results, leveledUp, newLevel));
};
