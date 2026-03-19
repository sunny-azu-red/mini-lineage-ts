import { describe, it, expect, vi } from 'vitest';
import { renderDeathView } from './player.view';
import { PlayerState } from '@/interface';

vi.mock('./base.view', () => ({
    readTemplate: vi.fn().mockReturnValue({ content: '', filename: 'death.ejs' }),
    render: vi.fn().mockReturnValue('<html>Death View Content</html>')
}));

vi.mock('./layout.view', () => ({
    renderPage: vi.fn().mockImplementation((title, player, content) => content),
    renderSimplePage: vi.fn()
}));

const makePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
    raceId: 0,
    health: 0,
    adena: 0,
    experience: 0,
    weaponId: 0,
    armorId: 0,
    dead: true,
    ...overrides,
} as PlayerState);

describe('player.view', () => {
    describe('renderDeathView', () => {
        it('assigns specific message for trapped ambushed players', () => {
            const p = makePlayer({ ambushed: true, coward: true });
            renderDeathView(p);
            expect(p.deathReason).toContain('caught trying to flee an ambush');
        });

        it('assigns coward message for non-ambushed cowards', () => {
            const p = makePlayer({ ambushed: false, coward: true });
            renderDeathView(p);
            expect(p.deathReason).toContain('cowardly way out');
        });

        it('assigns random death message for normal deaths', () => {
            const p = makePlayer({ coward: false });
            renderDeathView(p);
            expect(p.deathReason).toBeDefined();
            expect(p.deathReason).not.toContain('cowardly');
        });

        it('preserves existing deathReason if already set', () => {
            const p = makePlayer({ deathReason: 'Custom Death' });
            renderDeathView(p);
            expect(p.deathReason).toBe('Custom Death');
        });
    });
});
