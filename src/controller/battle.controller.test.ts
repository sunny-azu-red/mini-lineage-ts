import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBattle } from './battle.controller';
import * as battleService from '@/service/battle.service';
import * as playerService from '@/service/player.service';
import * as mathService from '@/service/math.service';
import { statisticsRepository } from '@/repository/statistics.repository';
import * as battleView from '@/view/battle.view';

vi.mock('@/service/battle.service', () => ({
    simulateBattle: vi.fn(),
}));

vi.mock('@/service/player.service', () => ({
    applyBattleResult: vi.fn(),
}));

vi.mock('@/service/math.service', () => ({
    randomInt: vi.fn(),
}));

vi.mock('@/repository/statistics.repository', () => ({
    statisticsRepository: {
        increment: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('@/view/battle.view', () => ({
    renderBattlegroundView: vi.fn().mockReturnValue('rendered-view'),
}));

describe('battleController', () => {
    let req: any;
    let res: any;
    let player: any;

    beforeEach(() => {
        vi.clearAllMocks();
        player = {
            raceId: 0,
            weaponId: 1,
            armorId: 1,
            health: 100,
            dead: false,
            ambushed: false,
            totalAmbushes: 0
        };
        req = {};
        res = {
            locals: { player },
            redirect: vi.fn(),
            send: vi.fn()
        };

        vi.mocked(battleService.simulateBattle).mockReturnValue({
            hpLost: 10,
            xpGained: 100,
            adenaGained: 50,
            enemiesKilled: 5,
            damageBlocked: 5
        } as any);
        vi.mocked(playerService.applyBattleResult).mockReturnValue(null);
        vi.mocked(mathService.randomInt).mockReturnValue(2); // No ambush by default
    });

    it('should reset ambushed state if it was true at start', () => {
        player.ambushed = true;
        getBattle(req, res);
        expect(player.ambushed).toBe(false);
    });

    it('should simulate battle and apply results', () => {
        getBattle(req, res);
        expect(battleService.simulateBattle).toHaveBeenCalledWith(player.weaponId, player.armorId);
        expect(playerService.applyBattleResult).toHaveBeenCalledWith(player, 10, 100, 50, 5, 5);
        expect(res.send).toHaveBeenCalledWith('rendered-view');
    });

    it('should redirect home if player is dead', () => {
        vi.mocked(playerService.applyBattleResult).mockImplementation((p: any) => {
            p.dead = true;
            return null;
        });
        getBattle(req, res);
        expect(res.redirect).toHaveBeenCalledWith('/death');
    });

    it('should increment totalAmbushes and statisticsRepository when ambush occurs', () => {
        vi.mocked(mathService.randomInt).mockReturnValue(1); // Ambush trigger
        getBattle(req, res);

        expect(player.ambushed).toBe(true);
        expect(player.totalAmbushes).toBe(1);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_ambushes');
    });

    it('should not increment totalAmbushes when ambush does not occur', () => {
        vi.mocked(mathService.randomInt).mockReturnValue(2); // No ambush
        getBattle(req, res);

        expect(player.ambushed).toBe(false);
        expect(player.totalAmbushes).toBe(0);
        expect(statisticsRepository.increment).not.toHaveBeenCalledWith('total_ambushes');
    });
});
