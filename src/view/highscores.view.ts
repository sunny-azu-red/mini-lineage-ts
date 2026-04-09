import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { formatAdena, slugify } from '@/util';
import { RACES } from '@/constant/game.constant';
import { HighscoreEntry } from '@/interface';

const highscoresTpl = readTemplate('highscores.ejs');

export function renderHighscoresView(highscores: HighscoreEntry[] = [], activeRaceId?: number): string {
    const rows = highscores.map((score) => {
        const d = new Date(score.created);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const emoji = RACES[score.race_id]?.emoji || '❓';

        return {
            name: `${emoji} ${score.name}`,
            level: score.level,
            totalXp: score.total_xp,
            adena: formatAdena(score.adena),
            date,
        };
    });
    const content = render(highscoresTpl, { rows, activeRaceId, races: RACES, slugify });

    return renderSimplePage('Hall of Champions', content);
}
