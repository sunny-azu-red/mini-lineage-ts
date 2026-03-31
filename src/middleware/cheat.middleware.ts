import { NextFunction, Request, Response } from 'express';
import { commitSuicide, isGameStarted } from '@/service/player.service';
import { statisticsRepository } from '@/repository/statistics.repository';

export const cheatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;
    const isHighscores = req.path.startsWith('/highscores');

    // checking dead players — cowards cannot access the highscores submit form
    const safePaths = ['/death', '/restart'];
    if (player.dead) {
        const isBlocked = !safePaths.includes(req.path) &&
            (player.coward || !isHighscores);
        if (isBlocked)
            return res.redirect('/death');
    }

    // checking alive players
    const deathPaths = ['/death', '/restart'];
    if (!player.dead && deathPaths.includes(req.path))
        return res.redirect('/');

    // kill ambushed players if they navigate away (cheaters)
    const ambushedPaths = ['/', '/shop/weapons', '/shop/armors', '/inn', '/suicide', '/death', '/restart', '/xp-table'];
    if (player.ambushed && !player.dead && (ambushedPaths.includes(req.path) || isHighscores)) {
        void statisticsRepository.increment('total_players_cheated');
        commitSuicide(player);
        return res.redirect('/death');
    }

    // prevent already initialized players from accessing start routes
    const startPaths = ['/start'];
    if (isGameStarted(player) && startPaths.includes(req.path))
        return res.redirect('/');

    // additional sanity checks for routes that require an initialized character
    const safePathsInit = ['/', '/start'];
    if (!isGameStarted(player) && !safePathsInit.includes(req.path) && !isHighscores)
        return res.redirect('/');

    next();
};
