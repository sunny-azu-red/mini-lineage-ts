import { dbPool } from '@/config/database.config';
import { GameStats, GameStatField } from '@/interface';

export const gameStatsRepository = {
    async increment(field: GameStatField, amount: number = 1): Promise<void> {
        await dbPool.execute(
            `UPDATE game_stats SET \`${field}\` = \`${field}\` + ? WHERE id = 1`,
            [amount]
        );
    },

    async getAll(): Promise<GameStats | null> {
        const [rows] = await dbPool.execute('SELECT * FROM game_stats WHERE id = 1');
        const result = rows as GameStats[];
        return result[0] ?? null;
    },
};
