import { Request, Response, NextFunction } from 'express';
import { calculateLevel } from '@/service/math.service';
import { renderHighscoresSubmitView, renderHighscoresView } from '@/view/highscores.view';
import { HighscoreNameSchema } from '@/schema/player.schema';
import { highscoreRepository } from '@/repository/highscore.repository';

export const getHighscoresSubmit = (req: Request, res: Response) => {
    res.send(renderHighscoresSubmitView(res.locals.player));
};

export const postHighscores = async (req: Request, res: Response, next: NextFunction) => {
    const player = res.locals.player;
    if (player.dead && !player.coward) {
        const parsed = HighscoreNameSchema.safeParse(req.body);
        if (!parsed.success)
            return next(new Error(`Invalid name, it's way too long!`));

        await highscoreRepository.insert({
            name: parsed.data.name,
            experience: player.experience,
            raceId: player.raceId,
            adena: player.adena,
            level: calculateLevel(player.experience),
        });

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
        const highscores = await highscoreRepository.findAll();
        res.send(renderHighscoresView(highscores));
    } catch (err) {
        next(err);
    }
};
