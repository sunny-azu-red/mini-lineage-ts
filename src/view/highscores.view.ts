import { readTemplate, render } from './base.view';
import { renderPage, renderSimplePage } from './layout.view';
import { formatAdena } from '@/util';
import { RACES } from '@/constant/game.constant';
import { HighscoreEntry, PlayerState } from '@/interface';

const highscoresTpl = readTemplate('highscores.ejs');
const highscoresSubmitTpl = readTemplate('highscores-submit.ejs');

export function renderHighscoresSubmitView(player: PlayerState): string {
    const content = render(highscoresSubmitTpl);

    return renderPage('Write your Legacy', player, content);
}

export function renderHighscoresView(highscores: HighscoreEntry[] = []): string {
    const rows = highscores.map((score) => {
        const d = new Date(score.created);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const emoji = RACES[score.race_id]?.emoji || '❓';

        return {
            name: `${emoji} ${score.name || 'Unsung Champion'}`,
            level: score.level,
            totalXp: score.total_xp,
            adena: formatAdena(score.adena),
            date,
        };
    });
    const content = render(highscoresTpl, { rows });

    return renderSimplePage('Hall of Champions', content);
}
