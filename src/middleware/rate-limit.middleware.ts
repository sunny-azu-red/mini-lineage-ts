import rateLimit from 'express-rate-limit';
import { renderRateLimitView } from '@/view/rate-limit.view';
import { isRelease } from '@/util';
import { GAME_VERSION } from '@/constant/game.constant';

export const battleRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 60, // 60 battles per minute
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => !isRelease(GAME_VERSION),
    handler: (req, res) => {
        const player = res.locals.player;
        const isAmbushed = player?.ambushed && !player?.dead;

        const message = isAmbushed
            ? "You are in the middle of an ambush and moving too fast. Please wait a moment before your next move."
            : "You are moving too fast. Please take a breath and try again in a moment.";

        res.status(429).send(renderRateLimitView(player, message, req.originalUrl));
    }
});

export const shopRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30, // 30 shop actions per minute
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => !isRelease(GAME_VERSION),
    handler: (req, res) => {
        const player = res.locals.player;
        const message = "You are moving too fast. Please take a breath and try again in a moment.";

        res.status(429).send(renderRateLimitView(player, message, req.originalUrl));
    }
});
