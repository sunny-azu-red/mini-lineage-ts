import rateLimit from 'express-rate-limit';

export const battleRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 60, // 60 battles/min — fast enough for a human, blocks bots
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Slow down, adventurer.',
});

export const shopRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30, // 30 shop actions/min
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Slow down, adventurer.',
});
