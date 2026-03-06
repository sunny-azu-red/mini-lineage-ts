import { z } from 'zod';

export const SuicideSchema = z.object({
    suicide: z.enum(['yes', 'no']),
});

export const HighscoreNameSchema = z.object({
    name: z.string().trim().max(32).optional(),
});
