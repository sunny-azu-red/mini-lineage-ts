import { Request, Response, NextFunction } from 'express';
import { PlayerState } from '../common/types';
import { isGameStarted } from '../common/utils';

export const cheatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const player = req.session as PlayerState;

    // checking dead players — cowards cannot access the highscores submit form
    const safePaths = ['/death', '/restart', '/highscores'];
    const cowardBlockedPaths = ['/highscores/submit'];
    if (player.dead) {
        const isBlocked = !safePaths.includes(req.path) &&
            (player.coward || player.cheater || !cowardBlockedPaths.includes(req.path));
        if (isBlocked)
            return res.redirect('/death');
    }

    // checking alive players
    const deathPaths = ['/death', '/restart', '/highscores/submit'];
    if (!player.dead && deathPaths.includes(req.path))
        return res.redirect('/');

    // prevent escaping from ambushes — die as a cheater
    if (player.ambushed && req.path !== '/battle') {
        player.dead = true;
        player.cheater = true;
        player.ambushed = false;
        return res.redirect('/death');
    }

    // prevent already initialized players from accessing start routes
    const startPaths = ['/human', '/orc'];
    if (isGameStarted(req) && startPaths.includes(req.path))
        return res.redirect('/');

    // additional sanity checks for routes that require an initialized character
    const safePathsInit = ['/', '/orc', '/human', '/highscores'];
    if (!isGameStarted(req) && !safePathsInit.includes(req.path))
        return res.redirect('/');

    next();
};
