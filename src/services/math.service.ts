import { MAX_LEVEL } from '../common/data';

// misc
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateSurpriseCount(enemiesKilled: number, divisor: number = 4): number {
    return Math.max(1, Math.floor(enemiesKilled / divisor));
}

// hp formulas
export function getLowHealthThreshold(maxHp: number): number {
    return Math.floor(maxHp * 0.25);
}

export function isLowHealth(health: number, maxHp: number): boolean {
    return health > 0 && health <= getLowHealthThreshold(maxHp);
}

// xp and level formulas
export function calculateExpForLevel(level: number): number {
    return level <= 1 ? 0 : Math.round(130 * Math.pow(level, 2) + 130 * level);
}

export function calculateLevel(exp: number): number {
    let level = 1;
    while (!isMaxLevel(level) && calculateExpForLevel(level + 1) <= exp)
        level++;
    return level;
}

export function isMaxLevel(level: number): boolean {
    return level >= MAX_LEVEL;
}

export function calculatePercentage(value: number, total: number, precision: number = 0): number {
    if (total <= 0) return 0;
    let p = (value / total) * 100;
    p = Math.max(0, Math.min(100, p));
    if (precision === 0) return Math.round(p);
    const factor = Math.pow(10, precision);
    return Math.round(p * factor) / factor;
}

export function getExpProgress(exp: number) {
    const level = calculateLevel(exp);
    const prevLimit = calculateExpForLevel(level);
    const nextLimit = calculateExpForLevel(level + 1);
    const current = exp - prevLimit;
    const required = nextLimit - prevLimit;

    return {
        current,
        required,
        percent: calculatePercentage(current, required, 1)
    };
}

export function getXpNeededToLevelUp(exp: number): number {
    const level = calculateLevel(exp);
    if (isMaxLevel(level)) return 0;
    return calculateExpForLevel(level + 1) - exp;
}

export function isLevelUp(oldExp: number, newExp: number): boolean {
    return calculateLevel(newExp) > calculateLevel(oldExp);
}

// battle scaling formulas
export function getEnemyCountRange(weaponStat: number, minMult: number = 0.3, maxMult: number = 0.6): { min: number, max: number } {
    return {
        min: Math.max(1, Math.floor(weaponStat * minMult)),
        max: Math.max(2, Math.floor(weaponStat * maxMult))
    };
}

export function calculateDangerLevel(weaponStat: number, multiplier: number = 0.6): number {
    return Math.floor(weaponStat * multiplier);
}

export function calculateDamageBlocked(armorStat: number, exponent: number = 0.95, multiplier: number = 0.8): number {
    return Math.max(1, Math.floor(Math.pow(armorStat, exponent) * multiplier));
}

export function calculateBaseExpGained(weaponStat: number, exponent: number = 1.5, multiplier: number = 0.8): number {
    return Math.floor(Math.pow(weaponStat, exponent) * multiplier);
}

export function calculateBaseAdenaGained(weaponStat: number, exponent: number = 2.65, multiplier: number = 0.05): number {
    return Math.floor(Math.pow(weaponStat, exponent) * multiplier);
}
