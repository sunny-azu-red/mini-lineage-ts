import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { renderSimplePage } from './layout';
import { formatAdena } from '../common/utils';
import { HEROES } from '../common/data';
import { Race } from '../common/types';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const highscoresTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'highscores.ejs'), 'utf8');
const highscoresSubmitTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'highscores-submit.ejs'), 'utf8');
const highscoresErrorTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'highscores-error.ejs'), 'utf8');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}

export function renderHighscoresSubmitView(): string {
    return renderSimplePage('Highscores', render(highscoresSubmitTpl, {}));
}

export function renderHighscoresView(highscores: any[]): string {
    let headerMessage = '';
    let footerMessage = 'Your name could be here too 😊';

    if (highscores.length === 0) {
        headerMessage = 'No heroes here yet...<br>';
        footerMessage = 'You could be the first one';
    }

    const rows = highscores.map((score, idx) => {
        const d = new Date(score.created);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const race = score.race as Race;
        const emoji = HEROES[race]?.emoji || '❓';
        return {
            name: `${emoji} ${score.name || 'Anonymous'}`,
            level: score.level,
            totalExp: score.total_exp,
            adena: formatAdena(score.adena),
            date,
        };
    });

    const content = render(highscoresTpl, { headerMessage, footerMessage, rows });
    return renderSimplePage('Hall of Champions', content);
}

export function renderHighscoresErrorView(): string {
    return renderSimplePage('Hall of Champions', render(highscoresErrorTpl, {}));
}
