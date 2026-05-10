import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { simulateBattle } from './battle.service';
import * as mathService from './math.service';
import { BATTLE_CONFIG } from '@/constant/game.constant';

describe('simulateBattle', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('always kills at least 1 enemy', () => {
        const result = simulateBattle(0, 1, 1);
        expect(result.enemiesKilled).toBeGreaterThanOrEqual(1);
    });

    it('hpLost is always at least 1 (BATTLE_CONFIG floor)', () => {
        const result = simulateBattle(0, 1, 1);
        expect(result.hpLost).toBeGreaterThanOrEqual(1);
    });

    it('xpGained is always positive', () => {
        const result = simulateBattle(0, 1, 1);
        expect(result.xpGained).toBeGreaterThan(0);
    });

    it('adenaGained is always positive', () => {
        const result = simulateBattle(0, 1, 1);
        expect(result.adenaGained).toBeGreaterThan(0);
    });

    it('better armor blocks more damage', () => {
        // Run multiple times to smooth randomness
        let weakBlocked = 0;
        let strongBlocked = 0;
        for (let i = 0; i < 50; i++) {
            weakBlocked += simulateBattle(0, 1, 0).damageBlocked;   // Peasant's Tunic (stat 2)
            strongBlocked += simulateBattle(0, 1, 5).damageBlocked; // Eternal Aegis (stat 88)
        }
        expect(strongBlocked).toBeGreaterThan(weakBlocked);
    });

    it('falls back gracefully on invalid weapon/armor ids', () => {
        expect(() => simulateBattle(0, 999, 999)).not.toThrow();
        const result = simulateBattle(0, 999, 999);
        expect(result.enemiesKilled).toBeGreaterThan(0);
        
        // Also test just one invalid to ensure individual fallbacks are hit
        const result2 = simulateBattle(0, 1, 999);
        expect(result2.damageBlocked).toBeGreaterThanOrEqual(0);
        const result3 = simulateBattle(0, 999, 1);
        expect(result3.enemiesKilled).toBeGreaterThan(0);
    });

    it('falls back gracefully on invalid raceId', () => {
        expect(() => simulateBattle(999, 0, 0)).not.toThrow();
        const result = simulateBattle(999, 0, 0);
        expect(result.enemiesKilled).toBeGreaterThan(0);
    });

    it('covers crit fallbacks for races and weapons with no crit stat', () => {
        // Orc has crit: 0, Brawler's Fists has crit: undefined
        const result = simulateBattle(1, 0, 0);
        expect(result.isCritical).toBeDefined();
    });

    it('sets isCritical to false and does not multiply enemiesKilled on normal hit', () => {
        vi.spyOn(mathService, 'calculateCritChance').mockReturnValue(false);
        vi.spyOn(mathService, 'randomInt').mockImplementation((min) => min);

        const result = simulateBattle(0, 1, 1);
        expect(result.isCritical).toBe(false);
        // We know randomInt returns min, which for weapon stat 16 is min=4. No multiplier.
        expect(result.enemiesKilled).toBe(4);
    });

    it('sets isCritical to true and multiplies enemiesKilled on critical hit', () => {
        vi.spyOn(mathService, 'calculateCritChance').mockReturnValue(true);
        vi.spyOn(mathService, 'randomInt').mockImplementation((min) => min);

        const result = simulateBattle(0, 1, 1);
        expect(result.isCritical).toBe(true);
        // We know randomInt returns min, which for weapon stat 16 is min=4.
        // Multiplier is 1.5, so 4 * 1.5 = 6.
        expect(result.enemiesKilled).toBe(Math.max(BATTLE_CONFIG.critChance.floor, Math.ceil(4 * BATTLE_CONFIG.critChance.multiplier)));
    });
});
