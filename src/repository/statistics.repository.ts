import { dbPool } from '@/config/database.config';
import { Statistics, StatField, StatRow } from '@/interface';

export const statisticsRepository = {
    async increment(field: StatField, amount: number = 1): Promise<void> {
        await dbPool.execute(
            `INSERT INTO statistics (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = value + ?`,
            [field, amount, amount]
        );
    },

    async getAll(): Promise<Statistics | null> {
        const [rows] = await dbPool.execute('SELECT name, value FROM statistics');
        const dbRows = rows as StatRow[];
        if (dbRows.length === 0)
            return null;

        return dbRows.reduce((acc, row) => {
            acc[row.name] = Number(row.value);
            return acc;
        }, {} as any) as Statistics;
    },
};
