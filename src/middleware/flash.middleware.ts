import { Request, Response, NextFunction } from 'express';
import { PlayerState, FlashMessage } from '@/interface';

export const flashMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // provide a global player object to all routes and views
    res.locals.player = req.session as PlayerState;

    if (req.session && req.session.flash) {
        res.locals.flash = req.session.flash as FlashMessage;
        delete req.session.flash;
    } else {
        res.locals.flash = null;
    }
    next();
};
