import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { renderPage, renderSimplePage } from './layout';
import { PlayerState } from '../common/types';
import { calculateExpForLevel } from '../services/math.service';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const suicideTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'suicide.ejs'), 'utf8');
const deathTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'death.ejs'), 'utf8');
const expTableTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'exp-table.ejs'), 'utf8');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}

export function renderSuicideView(player: PlayerState): string {
    return renderPage('Commit Suicide', player, render(suicideTpl, {}));
}

export function renderDeathView(reason: string): string {
    return renderSimplePage('Oops...', render(deathTpl, { reason }));
}

export function renderExpTableView(currentExp: number, currentLevel: number): string {
    const buildColumn = (start: number, end: number) => {
        const rows = [];
        for (let i = start; i <= end; i++) {
            const expReq = calculateExpForLevel(i);
            const rowClass = currentLevel === i ? 'row-current' : (i % 2 === 0 ? 'row-even' : 'row-odd');
            rows.push({ level: i, expReq, rowClass });
        }
        return rows;
    };

    const columns = [
        buildColumn(1, 20),
        buildColumn(21, 40),
        buildColumn(41, 60),
        buildColumn(61, 80),
    ];

    const xpNeeded = currentLevel < 80
        ? calculateExpForLevel(currentLevel + 1) - currentExp
        : 0;

    const content = render(expTableTpl, { columns, currentExp, currentLevel, xpNeeded });
    return renderSimplePage('Experience Table', content);
}
