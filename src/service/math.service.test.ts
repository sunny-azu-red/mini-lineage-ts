import { describe, it, expect } from 'vitest';
import {
    calculateXpForLevel,
    calculateLevel,
    isMaxLevel,
    isLevelUp,
    calculatePercentage,
    isLowHealth,
    getLowHealthThreshold,
    getXpNeededToLevelUp,
    calculateSurpriseCount,
    getEnemyCountRange,
    calculateDamageBlocked,
} from './math.service';

describe('calculateXpForLevel', () => {
    it('returns 0 for level 1', () => expect(calculateXpForLevel(1)).toBe(0));
    it('returns correct value for level 2', () => expect(calculateXpForLevel(2)).toBe(130 * 4 + 130 * 2)); // 780
    it('returns a large number for level 80', () => expect(calculateXpForLevel(80)).toBeGreaterThan(800_000));
});

describe('calculateLevel', () => {
    it('returns level 1 at 0 xp', () => expect(calculateLevel(0)).toBe(1));
    it('returns level 1 just below level 2 threshold', () => expect(calculateLevel(calculateXpForLevel(2) - 1)).toBe(1));
    it('returns level 2 at exact threshold', () => expect(calculateLevel(calculateXpForLevel(2))).toBe(2));
    it('returns level 10 at that threshold', () => expect(calculateLevel(calculateXpForLevel(10))).toBe(10));
});

describe('isMaxLevel', () => {
    it('returns false at level 79', () => expect(isMaxLevel(79)).toBe(false));
    it('returns true at level 80', () => expect(isMaxLevel(80)).toBe(true));
    it('returns true above level 80', () => expect(isMaxLevel(81)).toBe(true));
});

describe('isLevelUp', () => {
    it('returns true when xp crosses a level boundary', () => {
        const threshold = calculateXpForLevel(2);
        expect(isLevelUp(threshold - 1, threshold)).toBe(true);
    });
    it('returns false when both xp values are in the same level', () => {
        expect(isLevelUp(0, calculateXpForLevel(2) - 1)).toBe(false);
    });
});

describe('calculatePercentage', () => {
    it('returns 50 for half', () => expect(calculatePercentage(50, 100)).toBe(50));
    it('clamps to 100 when value exceeds total', () => expect(calculatePercentage(150, 100)).toBe(100));
    it('clamps to 0 when value is negative', () => expect(calculatePercentage(-10, 100)).toBe(0));
    it('returns 0 when total is 0', () => expect(calculatePercentage(50, 0)).toBe(0));
    it('supports decimal precision', () => expect(calculatePercentage(1, 3, 1)).toBe(33.3));
});

describe('getLowHealthThreshold', () => {
    it('returns 25 for maxHp 100', () => expect(getLowHealthThreshold(100)).toBe(25));
    it('returns 37 for maxHp 150', () => expect(getLowHealthThreshold(150)).toBe(37));
});

describe('isLowHealth', () => {
    it('returns true at exactly the threshold', () => expect(isLowHealth(25, 100)).toBe(true));
    it('returns false one above threshold', () => expect(isLowHealth(26, 100)).toBe(false));
    it('returns false at 0 hp (dead, not low)', () => expect(isLowHealth(0, 100)).toBe(false));
    it('returns false at full hp', () => expect(isLowHealth(100, 100)).toBe(false));
});

describe('getXpNeededToLevelUp', () => {
    it('returns 0 at max level', () => expect(getXpNeededToLevelUp(calculateXpForLevel(80))).toBe(0));
    it('returns a positive number mid-level', () => expect(getXpNeededToLevelUp(0)).toBeGreaterThan(0));
});

describe('calculateSurpriseCount', () => {
    it('divides enemies by divisor', () => expect(calculateSurpriseCount(8, 4)).toBe(2));
    it('returns minimum 1 when enemies < divisor', () => expect(calculateSurpriseCount(2, 4)).toBe(1));
    it('returns minimum 1 at 0', () => expect(calculateSurpriseCount(0)).toBe(1));
});

describe('getEnemyCountRange', () => {
    it('min is always at least 1', () => expect(getEnemyCountRange(1).min).toBeGreaterThanOrEqual(1));
    it('max is always at least min', () => {
        const { min, max } = getEnemyCountRange(7);
        expect(max).toBeGreaterThanOrEqual(min);
    });
});

describe('calculateDamageBlocked', () => {
    it('is always at least 1', () => expect(calculateDamageBlocked(1)).toBeGreaterThanOrEqual(1));
    it('higher armor stat blocks more', () => {
        expect(calculateDamageBlocked(88)).toBeGreaterThan(calculateDamageBlocked(2));
    });
});
