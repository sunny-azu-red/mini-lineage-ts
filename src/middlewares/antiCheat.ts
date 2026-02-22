import { Request, Response, NextFunction } from 'express';
import { isGameStarted } from '../common/utils';

export const antiCheatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const safePaths = ['/death', '/restart', '/highscores', '/highscores/submit', '/style/style.css'];

    if (req.session.dead && !safePaths.includes(req.path)) {
        return res.redirect('/death');
    }
    if (req.session.caught && req.path !== '/battle/ambush') {
        req.session.dead = true;
        req.session.caught = false;
        return res.redirect('/death?reason=coward');
    }

    // additional sanity checks for routes that require an initialized character
    const safePathsInit = ['/', '/orc', '/human', '/death', '/restart', '/highscores', '/highscores/submit', '/style/style.css'];
    if (!isGameStarted(req) && !safePathsInit.includes(req.path)) {
        return res.redirect('/');
    }

    next();
};
