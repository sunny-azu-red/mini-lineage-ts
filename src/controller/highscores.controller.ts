import { Request, Response, NextFunction } from 'express';
import { calculateLevel } from '@/service/math.service';
import { renderHighscoresSubmitView, renderHighscoresView } from '@/view/highscores.view';
import { db } from '@/config/database.config';
import { HighscoreEntry } from '@/interface';
import { HighscoreNameSchema } from '@/schema/player.schema';

export const getHighscoresSubmit = (req: Request, res: Response) => {
    res.send(renderHighscoresSubmitView(res.locals.player));
};

export const postHighscores = async (req: Request, res: Response) => {
    const player = res.locals.player;
    if (player.dead && !player.coward) {
        const parsed = HighscoreNameSchema.safeParse(req.body);
        const name = parsed.success ? (parsed.data.name || null) : null;
        const level = calculateLevel(player.experience);

        await db.execute(
            'INSERT INTO highscores (total_xp, name, race_id, adena, level, created) VALUES (?, ?, ?, ?, ?, NOW())',
            [player.experience, name, player.raceId, player.adena, level]
        );

        return req.session.destroy(() => {
            res.redirect('/highscores');
        });
    }

    res.redirect('/highscores');
};

export const getHighscores = async (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;
    if (player.dead)
        return res.redirect('/death');

    try {
        const [rows] = await db.execute('SELECT * FROM highscores ORDER BY total_xp DESC, adena DESC LIMIT 25');
        const highscores = rows as HighscoreEntry[];
        res.send(renderHighscoresView(highscores));
    } catch (err) {
        next(err);
    }
};
