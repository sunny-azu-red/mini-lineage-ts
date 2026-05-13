import { z } from 'zod';

export const SuicideSchema = z.object({
    suicide: z.enum(['yes', 'no']),
});
