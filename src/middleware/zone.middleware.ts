import { Request, Response, NextFunction } from 'express';
import { TICK_CONFIG } from '@/constant/game.constant';
import { isGameStarted } from '@/service/player.service';

/**
 * zoneMiddleware — updates session flags based on the current URL path.
 * This ensures the server tick knows if the player is in a resting or combat zone.
 */
export const zoneMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;

    if (req.method === 'GET' && player && isGameStarted(player)) {
        const path = req.path;

        player.isResting = (TICK_CONFIG.restingZones as readonly string[]).includes(path);
        player.inCombat = (TICK_CONFIG.combatZones as readonly string[]).includes(path);
    }

    next();
};
