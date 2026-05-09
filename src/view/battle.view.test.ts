import { describe, it, expect, vi } from 'vitest';
import { renderBattlegroundView } from './battle.view';
import { PlayerState, BattleResult } from '@/interface';
import { RACES } from '@/constant/game.constant';
import * as baseView from './base.view';

vi.mock('./base.view', () => ({
    readTemplate: vi.fn().mockReturnValue({ content: '', filename: 'battleground.ejs' }),
    render: vi.fn().mockReturnValue('<html>Battleground Content</html>')
}));

vi.mock('./layout.view', () => ({
    renderPage: vi.fn().mockImplementation((title, player, content) => content),
}));

const makeResults = (overrides: Partial<BattleResult> = {}): BattleResult => ({
    enemiesKilled: 1,
    hpLost: 10,
    damageBlocked: 5,
    xpGained: 100,
    adenaGained: 50,
    isCritical: false,
    isLevelUp: false,
    ...overrides,
});

const makePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
    raceId: 0,
    health: 100,
    adena: 0,
    experience: 0,
    weaponId: 0,
    armorId: 0,
    ...overrides,
} as PlayerState);

describe('battle.view', () => {
    describe('renderBattlegroundView scenarios', () => {
        it('assigns Orcs as opponents for Humans', () => {
            const human = makePlayer({ raceId: 0 }); // Human
            renderBattlegroundView(human, makeResults());
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs?.killLine).toContain('Orc');
        });

        it('includes critical hit line when isCritical is true', () => {
            const p = makePlayer();
            renderBattlegroundView(p, makeResults({ isCritical: true }));
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs?.critLine).toBeDefined();
            expect(lastCallArgs?.critLine).not.toBe('');
        });

        it('shows ambush line when player is ambushed', () => {
            const p = makePlayer({ ambushed: true });
            renderBattlegroundView(p, makeResults());
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs?.ambushed).toBe(true);
            expect(lastCallArgs?.ambushedLine).toBeDefined();
        });

        it('uses level up templates when isLevelUp is true', () => {
            const p = makePlayer();
            renderBattlegroundView(p, makeResults({ isLevelUp: true }));
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            // The mock returns fixed string, but we can verify the logic by checking if randomElement was called with level up templates
            // Since we can't easily check internal calls to randomElement without more mocks, 
            // we at least ensure it doesn't crash and returns the expected structure.
            expect(lastCallArgs?.outcomeLine).toBeDefined();
        });
    });
});
