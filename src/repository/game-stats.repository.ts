import { dbPool } from '@/config/database.config';
import { GameStats, GameStatField, GameStatRow } from '@/interface';

export const gameStatsRepository = {
    async increment(field: GameStatField, amount: number = 1): Promise<void> {
        await dbPool.execute(
            `INSERT INTO game_stats (stat_name, stat_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE stat_value = stat_value + ?`,
            [field, amount, amount]
        );
    },

    async getAll(): Promise<GameStats | null> {
        const [rows] = await dbPool.execute('SELECT stat_name, stat_value FROM game_stats');
        const dbRows = rows as GameStatRow[];
        if (dbRows.length === 0)
            return null;

        return dbRows.reduce((acc, row) => {
            acc[row.stat_name] = Number(row.stat_value);
            return acc;
        }, {} as any) as GameStats;
    },
};
