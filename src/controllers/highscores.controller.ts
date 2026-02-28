import { Request, Response } from 'express';
import { PlayerState } from '../common/types';
import { calculateLevel } from '../services/math.service';
import { renderHighscoresSubmitView, renderHighscoresView, renderHighscoresErrorView } from '../views/highscores.views';
import { db } from '../config/db.config';

export const getHighscoresSubmit = (req: Request, res: Response) => {
    res.send(renderHighscoresSubmitView());
};

export const postHighscores = async (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    if (player.dead && !player.coward && !player.ambushed) {
        const name = req.body.name?.trim() || null;
        const level = calculateLevel(player.experience);

        await db.execute(
            'INSERT INTO highscores (total_exp, name, hero_id, adena, level, created) VALUES (?, ?, ?, ?, ?, NOW())',
            [player.experience, name, player.heroId, player.adena, level]
        );

        return req.session.destroy(() => {
            res.redirect('/highscores');
        });
    }

    res.redirect('/highscores');
};

export const getHighscores = async (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    if (player.dead)
        return res.redirect('/death');

    try {
        const [rows] = await db.execute('SELECT * FROM highscores ORDER BY total_exp DESC, adena DESC LIMIT 25');
        const highscores = rows as any[];
        res.send(renderHighscoresView(highscores));
    } catch (err) {
        console.error(err);
        res.send(renderHighscoresErrorView());
    }
};
