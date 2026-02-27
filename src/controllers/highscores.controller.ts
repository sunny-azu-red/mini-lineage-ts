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
    if (player.dead && !player.coward && !player.inscribed) {
        const name = req.body.name || 'Anonymous';
        const level = calculateLevel(player.experience);

        await db.execute(
            'INSERT INTO highscores (total_exp, name, race, adena, level, created) VALUES (?, ?, ?, ?, ?, NOW())',
            [player.experience, name, player.race, player.adena, level]
        );
        player.inscribed = true;
    }

    res.redirect('/highscores');
};

export const getHighscores = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.execute('SELECT * FROM highscores ORDER BY total_exp DESC, adena DESC LIMIT 25');
        const highscores = rows as any[];
        res.send(renderHighscoresView(highscores));
    } catch (err) {
        console.error(err);
        res.send(renderHighscoresErrorView());
    }
};
