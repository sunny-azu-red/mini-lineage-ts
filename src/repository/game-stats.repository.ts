import { db } from '@/config/database.config';

export type GameStatField =
    | 'total_battles'
    | 'total_deaths'
    | 'total_ambushes'
    | 'total_enemies_killed'
    | 'total_adena_generated'
    | 'total_players';

export interface GameStats {
    id: number;
    total_battles: number;
    total_deaths: number;
    total_ambushes: number;
    total_enemies_killed: number;
    total_adena_generated: number;
    total_players: number;
}

export const gameStatsRepository = {
    async increment(field: GameStatField, amount: number = 1): Promise<void> {
        await db.execute(
            `UPDATE game_stats SET \`${field}\` = \`${field}\` + ? WHERE id = 1`,
            [amount]
        );
    },

    async getAll(): Promise<GameStats | null> {
        const [rows] = await db.execute('SELECT * FROM game_stats WHERE id = 1');
        const result = rows as GameStats[];
        return result[0] ?? null;
    },
};
