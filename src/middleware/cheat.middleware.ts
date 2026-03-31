import { NextFunction, Request, Response } from 'express';
import { commitSuicide, isGameStarted } from '@/service/player.service';
import { statisticsRepository } from '@/repository/statistics.repository';

export const cheatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;
    const isHighscores = req.path.startsWith('/highscores');

    // checking dead players — cowards cannot post to the highscores
    if (player.dead) {
        const isSafePath = ['/death', '/restart'].includes(req.path);
        const canSubmitLegacy = req.method === 'POST' && req.path === '/highscores' && !player.coward;
        if (!isSafePath && !canSubmitLegacy)
            return res.redirect('/death');

        return next(); // dead players don't need further checks
    }

    // checking alive players
    const isDeathPath = ['/death', '/restart'].includes(req.path);
    if (isDeathPath)
        return res.redirect('/');

    // kill ambushed players if they navigate away (cheaters)
    if (player.ambushed && req.path !== '/battle') {
        void statisticsRepository.increment('total_players_cheated');
        commitSuicide(player);
        return res.redirect('/death');
    }

    // prevent already initialized players from accessing start routes
    if (isGameStarted(player) && req.path === '/start')
        return res.redirect('/');

    // additional sanity checks for routes that require an initialized character
    if (!isGameStarted(player)) {
        const isUninitializedSafePath = ['/', '/start'].includes(req.path) || isHighscores;
        if (!isUninitializedSafePath)
            return res.redirect('/');
    }

    next();
};
