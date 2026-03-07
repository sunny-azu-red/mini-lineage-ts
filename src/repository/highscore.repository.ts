import { db } from '@/config/database.config';
import { HighscoreEntry } from '@/interface';

export const highscoreRepository = {
    async insert(data: { name: string | null; experience: number; raceId: number; adena: number; level: number }): Promise<void> {
        await db.execute(
            'INSERT INTO highscores (name, total_xp, race_id, adena, level, created) VALUES (?, ?, ?, ?, ?, NOW())',
            [data.name, data.experience, data.raceId, data.adena, data.level]
        );
    },

    async findAll(): Promise<HighscoreEntry[]> {
        const [rows] = await db.execute('SELECT * FROM highscores ORDER BY total_xp DESC, adena DESC LIMIT 25');
        return rows as HighscoreEntry[];
    },
};
