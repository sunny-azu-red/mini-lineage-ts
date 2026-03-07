import { describe, it, expect } from 'vitest';
import { simulateBattle } from './battle.service';

describe('simulateBattle', () => {
    it('always kills at least 1 enemy', () => {
        const result = simulateBattle(1, 1);
        expect(result.enemiesKilled).toBeGreaterThanOrEqual(1);
    });

    it('hpLost is always at least 1 (BATTLE_CONFIG floor)', () => {
        const result = simulateBattle(1, 1);
        expect(result.hpLost).toBeGreaterThanOrEqual(1);
    });

    it('xpGained is always positive', () => {
        const result = simulateBattle(1, 1);
        expect(result.xpGained).toBeGreaterThan(0);
    });

    it('adenaGained is always positive', () => {
        const result = simulateBattle(1, 1);
        expect(result.adenaGained).toBeGreaterThan(0);
    });

    it('better armor blocks more damage', () => {
        // Run multiple times to smooth randomness
        let weakBlocked = 0;
        let strongBlocked = 0;
        for (let i = 0; i < 50; i++) {
            weakBlocked += simulateBattle(1, 0).damageBlocked;   // Peasant's Tunic (stat 2)
            strongBlocked += simulateBattle(1, 5).damageBlocked; // Eternal Aegis (stat 88)
        }
        expect(strongBlocked).toBeGreaterThan(weakBlocked);
    });

    it('falls back gracefully on invalid weapon/armor ids', () => {
        expect(() => simulateBattle(999, 999)).not.toThrow();
    });
});
