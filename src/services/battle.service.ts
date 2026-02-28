import { randomInt } from '../common/utils';
import { BattleResult } from '../common/types';
import { WEAPONS, ARMORS } from '../common/data';

export function simulateBattle(weaponId: number, armorId: number): BattleResult {
    const weapon = WEAPONS[weaponId]?.stat || WEAPONS[0].stat;
    const armor = ARMORS[armorId]?.stat || ARMORS[0].stat;

    // enemies killed: scales dynamically with weapon stat
    const minEnemies = Math.max(1, Math.floor(weapon * 0.3));
    const maxEnemies = Math.max(2, Math.floor(weapon * 0.6));
    const enemiesKilled = randomInt(minEnemies, maxEnemies);

    // hp lost: danger scales linearly, but armor scales sub-linearly to prevent invincibility
    const dangerLevel = Math.floor(weapon * 0.6);
    const damageBlocked = Math.floor(Math.pow(armor, 0.95) * 0.8);
    const hpLost = Math.max(1, randomInt(10, 25) + dangerLevel - damageBlocked);

    // experience gained: scales nicely with weapon
    const expGained = (enemiesKilled * randomInt(10, 18)) + Math.floor(Math.pow(weapon, 1.5) * 0.8);

    // adena gained: exponential scaling for smoother economy pacing
    const adenaGained = (enemiesKilled * randomInt(2, 4)) + Math.floor(Math.pow(weapon, 2.65) * 0.05);

    return {
        enemiesKilled,
        hpLost,
        damageBlocked,
        expGained,
        adenaGained
    };
}
