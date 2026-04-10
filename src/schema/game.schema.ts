import { z } from 'zod';
import { RACES } from '@/constant/game.constant';
import { itemIdSchema } from './common.schema';

const RACE_IDS = RACES.map(r => r.id);

export const GameStartSchema = z.object({
    select_race: itemIdSchema(RACE_IDS),
    name: z.string().trim().min(1).max(18),
});
