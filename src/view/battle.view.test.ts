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
    describe('renderBattlegroundView opponent logic', () => {
        it('assigns Orcs as opponents for Humans', () => {
            const human = makePlayer({ raceId: 0 }); // Human
            renderBattlegroundView(human, makeResults());
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs?.battleText).toContain('Orc');
        });

        it('assigns Humans as opponents for Orcs', () => {
            const orc = makePlayer({ raceId: 1 }); // Orc
            renderBattlegroundView(orc, makeResults());
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs?.battleText).toContain('Human');
        });

        it('assigns Dark Elves as opponents for Elves', () => {
            const elf = makePlayer({ raceId: 2 }); // Elf
            renderBattlegroundView(elf, makeResults());
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs?.battleText).toContain('Dark Elf');
        });
    });
});
