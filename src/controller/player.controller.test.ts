import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postSuicide } from './player.controller';
import { commitSuicide } from '@/service/player.service';
import { gameStatsRepository } from '@/repository/game-stats.repository';

vi.mock('@/service/player.service', () => ({
    commitSuicide: vi.fn(),
    calculateLevel: vi.fn()
}));

vi.mock('@/repository/game-stats.repository', () => ({
    gameStatsRepository: {
        increment: vi.fn().mockResolvedValue(undefined),
    },
}));

describe('playerController', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { body: {} };
        res = {
            locals: { player: {} },
            redirect: vi.fn(),
            send: vi.fn()
        };
        next = vi.fn();
    });

    describe('postSuicide', () => {
        it('should increment total_players_suicided and commit suicide when confirmed', () => {
            req.body.suicide = 'yes';
            postSuicide(req, res, next);

            expect(gameStatsRepository.increment).toHaveBeenCalledWith('total_players_suicided');
            expect(commitSuicide).toHaveBeenCalledWith(res.locals.player);
            expect(res.redirect).toHaveBeenCalledWith('/death');
        });

        it('should redirect home and not increment if suicide is not confirmed', () => {
            req.body.suicide = 'no';
            postSuicide(req, res, next);

            expect(gameStatsRepository.increment).not.toHaveBeenCalled();
            expect(commitSuicide).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('should call next with error if validation fails', () => {
            req.body = {}; // missing suicide field
            postSuicide(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.redirect).not.toHaveBeenCalled();
        });
    });
});
