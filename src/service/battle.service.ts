import { BattleResult } from '@/interface';
import { WEAPONS, ARMORS, BATTLE_CONFIG } from '@/constant/game.constant';
import { randomInt, getEnemyCountRange, calculateDangerLevel, calculateDamageBlocked, calculateBaseXpGained, calculateBaseAdenaGained } from '@/service/math.service';

export function simulateBattle(weaponId: number, armorId: number): BattleResult {
    const weapon = WEAPONS[weaponId]?.stat || WEAPONS[0].stat;
    const armor = ARMORS[armorId]?.stat || ARMORS[0].stat;

    // enemies killed: scales dynamically with weapon stat
    const { min: minEnemies, max: maxEnemies } = getEnemyCountRange(weapon, BATTLE_CONFIG.enemyCount.minMult, BATTLE_CONFIG.enemyCount.maxMult);
    const enemiesKilled = randomInt(minEnemies, maxEnemies);

    // hp lost: danger scales linearly, armor scales sub-linearly to prevent invincibility
    const dangerLevel = calculateDangerLevel(weapon, BATTLE_CONFIG.dangerLevel.scaling);
    const damageBlocked = calculateDamageBlocked(armor, BATTLE_CONFIG.damageBlocked.exponent, BATTLE_CONFIG.damageBlocked.scaling);
    const hpLost = Math.max(BATTLE_CONFIG.hpLost.floor, randomInt(BATTLE_CONFIG.hpLost.baseMin, BATTLE_CONFIG.hpLost.baseMax) + dangerLevel - damageBlocked);

    // experience gained: scales nicely with weapon
    const xpGained = (enemiesKilled * randomInt(BATTLE_CONFIG.xpGained.killMin, BATTLE_CONFIG.xpGained.killMax)) + calculateBaseXpGained(weapon, BATTLE_CONFIG.xpGained.exponent, BATTLE_CONFIG.xpGained.scaling);

    // adena gained: exponential scaling for smoother economy pacing
    const adenaGained = (enemiesKilled * randomInt(BATTLE_CONFIG.adenaGained.killMin, BATTLE_CONFIG.adenaGained.killMax)) + calculateBaseAdenaGained(weapon, BATTLE_CONFIG.adenaGained.exponent, BATTLE_CONFIG.adenaGained.scaling);

    return { enemiesKilled, hpLost, damageBlocked, xpGained, adenaGained };
}
