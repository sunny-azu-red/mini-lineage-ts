import { Request, Response, NextFunction } from 'express';
import { TICK_CONFIG } from '@/constant/game.constant';
import { isGameStarted } from '@/service/player.service';

/**
 * zoneMiddleware — updates session flags based on the current URL path.
 * This ensures the server tick knows if the player is in a resting or combat zone.
 */
export const zoneMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;
    const isPageRequest = req.headers.accept?.includes('text/html'); // only update zone on HTML GETs to protect the "Resting" state from background noise.

    if (req.method === 'GET' && isPageRequest && player && isGameStarted(player)) {
        const path = req.path;

        player.isResting = (TICK_CONFIG.restingZones as readonly string[]).includes(path);
        player.inCombat = (TICK_CONFIG.combatZones as readonly string[]).includes(path);
    }

    next();
};
