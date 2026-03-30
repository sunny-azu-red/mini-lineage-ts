import { Request, Response } from 'express';
import { calculateLevel } from '@/service/math.service';
import { renderHighscoresView } from '@/view/highscores.view';
import { highscoreRepository } from '@/repository/highscore.repository';

export const postHighscores = async (req: Request, res: Response) => {
    const player = res.locals.player;
    if (player.dead && !player.coward) {
        await highscoreRepository.insert({
            name: player.name ?? null,
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

export const getHighscores = async (req: Request, res: Response) => {
    const player = res.locals.player;
    if (player.dead)
        return res.redirect('/death');

    const raceParam = req.query.race;
    const raceId = raceParam !== undefined ? parseInt(String(raceParam), 10) : undefined;
    const filteredRaceId = (raceId !== undefined && !isNaN(raceId)) ? raceId : undefined;

    const highscores = await highscoreRepository.findAll(filteredRaceId);
    res.send(renderHighscoresView(highscores, filteredRaceId));
};
