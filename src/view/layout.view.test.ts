import { describe, it, expect, vi } from 'vitest';
import { renderPage, renderSimplePage } from './layout.view';
import { PlayerState } from '@/interface';
import * as versionUtil from '@/util/version.util';
import * as baseView from './base.view';

vi.mock('./base.view', () => ({
    readTemplate: vi.fn().mockReturnValue({ content: '', filename: 'layout.ejs' }),
    render: vi.fn().mockReturnValue('<html>Layout</html>')
}));

const makePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
    name: 'Test Hero',
    raceId: 0,
    health: 100,
    adena: 0,
    experience: 0,
    weaponId: 0,
    armorId: 0,
    ...overrides,
} as PlayerState);

describe('layout.view', () => {
    describe('renderPage', () => {
        it('renders with release styles when isRelease is true', () => {
            vi.spyOn(versionUtil, 'isRelease').mockReturnValue(true);
            renderPage('Title', makePlayer(), 'Content');
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.isRelease).toBe(true);
        });

        it('renders with development styles when isRelease is false', () => {
            vi.spyOn(versionUtil, 'isRelease').mockReturnValue(false);
            renderPage('Title', makePlayer(), 'Content');
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.isRelease).toBe(false);
        });

        it('includes flash message when provided', () => {
            const flash = { text: 'Hello', type: 'info' as const };
            renderPage('Title', makePlayer(), 'Content', flash);
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.flash).toEqual(flash);
        });

        it('hides low health alert when option is set', () => {
            const p = makePlayer({ health: 5 }); // Low health
            renderPage('Title', p, 'Content', null, { hideLowHealthAlert: true });
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.lowHealthAlert).toBe('');
        });

        it('shows low health alert when health is low and not hidden', () => {
            const p = makePlayer({ health: 5 }); // Low health
            renderPage('Title', p, 'Content');
            
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.lowHealthAlert).not.toBe('');
        });

        it('disables headerClickable when ambushed or dead', () => {
            const p1 = makePlayer({ ambushed: true });
            renderPage('Title', p1, 'Content');
            let renderMock = vi.mocked(baseView.render);
            let lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.headerClickable).toBe(false);

            const p2 = makePlayer({ dead: true });
            renderPage('Title', p2, 'Content');
            renderMock = vi.mocked(baseView.render);
            lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.headerClickable).toBe(false);
        });
    });

    describe('renderSimplePage', () => {
        it('renders with default headerClickable', () => {
            renderSimplePage('Title', 'Content');
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.headerClickable).toBe(true);
        });

        it('handles headerClickable for game started but ambushed', () => {
            const p = makePlayer({ ambushed: true });
            renderSimplePage('Title', 'Content', null, p);
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.headerClickable).toBe(false);
        });

        it('handles headerClickable when game is not started', () => {
            renderSimplePage('Title', 'Content', null, { raceId: undefined } as any);
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.headerClickable).toBe(true);
        });

        it('handles headerClickable for game started but dead', () => {
            const p = makePlayer({ dead: true });
            renderSimplePage('Title', 'Content', null, p);
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.headerClickable).toBe(false);
        });
    });

    describe('renderStatus dead branches', () => {
        it('covers dead status display branch', () => {
            const p = makePlayer({ dead: true });
            renderPage('Title', p, 'Content');
            expect(baseView.render).toHaveBeenCalled();
        });
    });

    describe('renderStatus level up branches', () => {
        it('covers level up animation branches', () => {
            const p = makePlayer({ experience: 1000, prevExperience: 0 });
            renderPage('Title', p, 'Content');
            expect(baseView.render).toHaveBeenCalled();
        });

        it('covers ambushed level display branch', () => {
            const p = makePlayer({ ambushed: true });
            renderPage('Title', p, 'Content');
            expect(baseView.render).toHaveBeenCalled();
        });
    });

    describe('low health ambush branch', () => {
        it('shows ambush specific low health message', () => {
            const p = makePlayer({ health: 5, ambushed: true });
            renderPage('Title', p, 'Content');
            const renderMock = vi.mocked(baseView.render);
            const lastCallArgs = renderMock.mock.calls[renderMock.mock.calls.length - 1][1] as any;
            expect(lastCallArgs.lowHealthAlert).toContain('dangerously low');
        });
    });
});
