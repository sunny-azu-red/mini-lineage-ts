import { BattleResult } from '@/interface';
import { WEAPONS, ARMORS, BATTLE_CONFIG, RACES } from '@/constant/game.constant';
import { randomInt, calculateCritChance, getEnemyCountRange, calculateDangerLevel, calculateDamageBlocked, calculateBaseXpGained, calculateBaseAdenaGained } from '@/service/math.service';

export function simulateBattle(raceId: number, weaponId: number, armorId: number): BattleResult {
    const race = RACES[raceId] || RACES[0];
    const weaponObj = WEAPONS[weaponId] || WEAPONS[0];
    const weapon = weaponObj.stat;
    const armor = ARMORS[armorId]?.stat || ARMORS[0].stat;
    const critChance = (race.crit || 0) + (weaponObj.crit || 0);
    const isCritical = calculateCritChance(critChance);

    // enemies killed: scales dynamically with weapon stat
    const { min: minEnemies, max: maxEnemies } = getEnemyCountRange(weapon, BATTLE_CONFIG.enemyCount.minMult, BATTLE_CONFIG.enemyCount.maxMult);
    let enemiesKilled = randomInt(minEnemies, maxEnemies);
    if (isCritical)
        enemiesKilled = Math.max(BATTLE_CONFIG.critChance.floor, Math.ceil(enemiesKilled * BATTLE_CONFIG.critChance.multiplier));

    // hp lost: danger scales linearly, armor scales sub-linearly to prevent invincibility
    const dangerLevel = calculateDangerLevel(weapon, BATTLE_CONFIG.dangerLevel.scaling);
    const damageBlocked = calculateDamageBlocked(armor, BATTLE_CONFIG.damageBlocked.exponent, BATTLE_CONFIG.damageBlocked.scaling);
    const hpLost = Math.max(BATTLE_CONFIG.hpLost.floor, randomInt(BATTLE_CONFIG.hpLost.baseMin, BATTLE_CONFIG.hpLost.baseMax) + dangerLevel - damageBlocked);

    // experience gained: scales nicely with weapon && adena gained: exponential scaling for smoother economy pacing
    let xpGained = (enemiesKilled * randomInt(BATTLE_CONFIG.xpGained.killMin, BATTLE_CONFIG.xpGained.killMax)) + calculateBaseXpGained(weapon, BATTLE_CONFIG.xpGained.exponent, BATTLE_CONFIG.xpGained.scaling);
    let adenaGained = (enemiesKilled * randomInt(BATTLE_CONFIG.adenaGained.killMin, BATTLE_CONFIG.adenaGained.killMax)) + calculateBaseAdenaGained(weapon, BATTLE_CONFIG.adenaGained.exponent, BATTLE_CONFIG.adenaGained.scaling);
    if (isCritical) { // critical hits multiply total rewards so they stay impactful at all weapon tiers
        xpGained = Math.ceil(xpGained * BATTLE_CONFIG.critChance.multiplier);
        adenaGained = Math.ceil(adenaGained * BATTLE_CONFIG.critChance.multiplier);
    }

    return { enemiesKilled, hpLost, damageBlocked, xpGained, adenaGained, isCritical };
}
