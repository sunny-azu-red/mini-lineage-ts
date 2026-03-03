import { Request, Response, NextFunction } from 'express';
import { PlayerState } from '../common/types';
import { isGameStarted } from '../services/player.service';
import { GAME_VERSION } from '../common/data';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // sync previous state flags BEFORE the controllers run
    // if (req.session && isGameStarted(req.session as PlayerState)) {
    //     req.session.prevHealth = req.session.health;
    //     req.session.prevAdena = req.session.adena;
    //     req.session.prevExperience = req.session.experience;
    // }

    res.on('finish', () => {
        if (GAME_VERSION !== 'Bleeding Edge')
            return;

        const duration = Date.now() - start;
        console.log(`\n[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);

        if (req.session) {
            const state = { ...req.session };
            delete (state as any).cookie;

            console.dir({ '📦 Player State:': state }, { colors: true, depth: null });
        }
        // console.log('------------------------------------------');
    });

    next();
};
