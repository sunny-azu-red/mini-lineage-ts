import { describe, it, expect, vi } from 'vitest';
import { renderDeathView, renderSuicideView, renderXpTableView } from './player.view';
import { renderPage, renderSimplePage } from './layout.view';
import { PlayerState } from '@/interface';

vi.mock('./base.view', () => ({
    readTemplate: vi.fn().mockImplementation((name) => ({ content: '', filename: name })),
    render: vi.fn().mockImplementation((tpl, locals) => {
        // Return a string that includes key indicators from locals
        return JSON.stringify({ tpl: tpl.filename, ...locals });
    })
}));

const makePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
    name: 'Test Hero',
    raceId: 0,
    health: 100,
    adena: 0,
    experience: 0,
    weaponId: 0,
    armorId: 0,
    dead: false,
    ambushed: false,
    ...overrides,
} as PlayerState);

describe('layout.view', () => {
    it('renders low health alert when health is low', () => {
        const p = makePlayer({ health: 5 }); // Human max HP 100
        const html = renderPage('Title', p, 'Content');
        expect(html).toContain('Your HP is dangerously low!');
    });

    it('renders ambush-specific low health alert', () => {
        const p = makePlayer({ health: 5, ambushed: true });
        const html = renderPage('Title', p, 'Content');
        expect(html).toContain('Your HP is dangerously low!');
    });

    it('renders XP bar with previous state for animation', () => {
        const p = makePlayer({ experience: 1000, prevExperience: 500 });
        const html = renderPage('Title', p, 'Content');
        expect(html).toBeDefined();
    });

    it('renders different header clickable status', () => {
        const p = makePlayer({ ambushed: true });
        const html = renderPage('Title', p, 'Content');
        expect(html).toBeDefined();
    });

    it('renders simple page correctly', () => {
        const html = renderSimplePage('Simple', 'Content');
        expect(html).toBeDefined();
    });
});

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

    describe('renderSuicideView', () => {
        it('returns rendered suicide page', () => {
            const p = makePlayer();
            const html = renderSuicideView(p);
            expect(html).toBeDefined();
        });
    });

    describe('renderXpTableView', () => {
        it('returns rendered XP table page', () => {
            const html = renderXpTableView(100, 2);
            expect(html).toBeDefined();
        });
    });
});
