import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cheatMiddleware } from './cheat.middleware';
import * as playerService from '@/service/player.service';
import { statisticsRepository } from '@/repository/statistics.repository';

vi.mock('@/service/player.service', () => ({
    commitSuicide: vi.fn(),
    isGameStarted: vi.fn()
}));

vi.mock('@/repository/statistics.repository', () => ({
    statisticsRepository: {
        increment: vi.fn().mockResolvedValue(undefined),
    },
}));

describe('cheatMiddleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { path: '/' };
        res = {
            locals: { player: { dead: false, ambushed: false } },
            redirect: vi.fn()
        };
        next = vi.fn();
        vi.mocked(playerService.isGameStarted).mockReturnValue(true);
    });

    describe('dead players', () => {
        it('should redirect dead players to /death if on restricted path', () => {
            res.locals.player.dead = true;
            req.path = '/shop';

            cheatMiddleware(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith('/death');
        });

        it('should allow dead players on safe paths', () => {
            res.locals.player.dead = true;
            req.path = '/death';

            cheatMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should allow dead players on filtered highscore paths', () => {
            res.locals.player.dead = true;
            req.path = '/highscores/elf';

            cheatMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('ambushed players', () => {
        it('should kill ambushed player if they navigate to forbidden path', () => {
            res.locals.player.ambushed = true;
            req.path = '/shop/weapons';

            cheatMiddleware(req, res, next);

            expect(statisticsRepository.increment).toHaveBeenCalledWith('total_players_cheated');
            expect(playerService.commitSuicide).toHaveBeenCalledWith(res.locals.player);
            expect(res.redirect).toHaveBeenCalledWith('/death');
        });

        it('should allow ambushed player on valid path', () => {
            res.locals.player.ambushed = true;
            req.path = '/battle';

            cheatMiddleware(req, res, next);

            expect(playerService.commitSuicide).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe('non-initialized players', () => {
        it('should redirect non-initialized players to / if on restricted path', () => {
            vi.mocked(playerService.isGameStarted).mockReturnValue(false);
            req.path = '/battle';

            cheatMiddleware(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('should allow non-initialized players on /start', () => {
            vi.mocked(playerService.isGameStarted).mockReturnValue(false);
            req.path = '/start';

            cheatMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should allow non-initialized players on filtered highscore paths', () => {
            vi.mocked(playerService.isGameStarted).mockReturnValue(false);
            req.path = '/highscores/dark-elf';

            cheatMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    it('should allow initialized players on valid paths', () => {
        vi.mocked(playerService.isGameStarted).mockReturnValue(true);
        req.path = '/battle';

        cheatMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
