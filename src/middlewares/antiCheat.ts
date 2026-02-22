import { Request, Response, NextFunction } from 'express';
import { isGameStarted } from '../common/utils';

export const antiCheatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // checking dead players
    const safePaths = ['/death', '/restart', '/highscores', '/highscores/submit'];
    if (req.session.dead && !safePaths.includes(req.path)) {
        return res.redirect('/death');
    }

    // checking alive players
    const deathPaths = ['/death', '/restart', '/highscores/submit'];
    if (!req.session.dead && deathPaths.includes(req.path)) {
        return res.redirect('/');
    }

    // prevent escaping from ambushes, die as a coward instead
    if (req.session.caught && req.path !== '/battle/ambush') {
        req.session.dead = true;
        req.session.caught = false;
        return res.redirect('/death?reason=coward');
    }

    // prevent already initialized players from accessing start routes
    const startPaths = ['/human', '/orc'];
    if (isGameStarted(req) && startPaths.includes(req.path)) {
        return res.redirect('/');
    }

    // additional sanity checks for routes that require an initialized character
    const safePathsInit = ['/', '/orc', '/human', '/highscores'];
    if (!isGameStarted(req) && !safePathsInit.includes(req.path)) {
        return res.redirect('/');
    }

    next();
};
