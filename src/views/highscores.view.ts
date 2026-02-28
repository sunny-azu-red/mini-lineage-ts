import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { formatAdena } from '../common/utils';
import { HEROES } from '../common/data';
import { HighscoreEntry } from '../common/types';

const highscoresTpl = readTemplate('highscores.ejs');
const highscoresSubmitTpl = readTemplate('highscores-submit.ejs');
const highscoresErrorTpl = readTemplate('highscores-error.ejs');

export function renderHighscoresSubmitView(): string {
    return renderSimplePage('Highscores', render(highscoresSubmitTpl, {}, 'highscores-submit.ejs'));
}

export function renderHighscoresView(highscores: HighscoreEntry[]): string {
    let headerMessage = '';
    let footerMessage = 'Your name could be here too 😊';

    if (highscores.length === 0) {
        headerMessage = 'No heroes here yet...<br>';
        footerMessage = 'You could be the first one';
    }

    const rows = highscores.map((score) => {
        const d = new Date(score.created);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const emoji = HEROES[score.hero_id]?.emoji || '❓';
        return {
            name: `${emoji} ${score.name || 'Unsung Hero'}`,
            level: score.level,
            totalExp: score.total_exp,
            adena: formatAdena(score.adena),
            date,
        };
    });

    const content = render(highscoresTpl, { headerMessage, footerMessage, rows }, 'highscores.ejs');
    return renderSimplePage('Hall of Champions', content);
}

export function renderHighscoresErrorView(): string {
    return renderSimplePage('Hall of Champions', render(highscoresErrorTpl, {}, 'highscores-error.ejs'));
}
