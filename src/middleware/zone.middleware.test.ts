import { describe, it, expect, vi } from 'vitest';
import { zoneMiddleware } from './zone.middleware';
import { TICK_CONFIG } from '@/constant/game.constant';
import * as playerService from '@/service/player.service';

vi.mock('@/service/player.service', () => ({
    isGameStarted: vi.fn()
}));

describe('zoneMiddleware', () => {
    it('should set isResting to true if path is in restingZones', () => {
        const player = { isResting: false, inCombat: false };
        const req = { method: 'GET', path: '/' };
        const res = { locals: { player } };
        const next = vi.fn();

        vi.mocked(playerService.isGameStarted).mockReturnValue(true);

        zoneMiddleware(req as any, res as any, next);

        expect(player.isResting).toBe(true);
        expect(player.inCombat).toBe(false);
        expect(next).toHaveBeenCalled();
    });

    it('should set inCombat to true if path is in combatZones', () => {
        const player = { isResting: false, inCombat: false };
        const req = { method: 'GET', path: '/battle' };
        const res = { locals: { player } };
        const next = vi.fn();

        vi.mocked(playerService.isGameStarted).mockReturnValue(true);

        zoneMiddleware(req as any, res as any, next);

        expect(player.isResting).toBe(false);
        expect(player.inCombat).toBe(true);
        expect(next).toHaveBeenCalled();
    });

    it('should do nothing if method is not GET', () => {
        const player = { isResting: false, inCombat: false };
        const req = { method: 'POST', path: '/' };
        const res = { locals: { player } };
        const next = vi.fn();

        vi.mocked(playerService.isGameStarted).mockReturnValue(true);

        zoneMiddleware(req as any, res as any, next);

        expect(player.isResting).toBe(false);
        expect(player.inCombat).toBe(false);
        expect(next).toHaveBeenCalled();
    });

    it('should do nothing if game is not started', () => {
        const player = { isResting: false, inCombat: false };
        const req = { method: 'GET', path: '/' };
        const res = { locals: { player } };
        const next = vi.fn();

        vi.mocked(playerService.isGameStarted).mockReturnValue(false);

        zoneMiddleware(req as any, res as any, next);

        expect(player.isResting).toBe(false);
        expect(player.inCombat).toBe(false);
        expect(next).toHaveBeenCalled();
    });

    it('should handle missing player gracefully', () => {
        const req = { method: 'GET', path: '/' };
        const res = { locals: {} };
        const next = vi.fn();

        zoneMiddleware(req as any, res as any, next);

        expect(next).toHaveBeenCalled();
    });
});
