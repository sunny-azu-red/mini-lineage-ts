import { readTemplate, render } from './base.view';
import { renderPage, renderSimplePage } from './layout.view';
import { PlayerState, FlashMessage } from '../common/types';
import { calculateExpForLevel } from '../services/math.service';

const suicideTpl = readTemplate('suicide.ejs');
const deathTpl = readTemplate('death.ejs');
const expTableTpl = readTemplate('exp-table.ejs');

export function renderSuicideView(player: PlayerState, flash: FlashMessage | null = null): string {
    return renderPage('Commit Suicide', player, render(suicideTpl), flash, { hideLowHealthAlert: true });
}

export function renderDeathView(reason: string, coward: boolean = false): string {
    return renderSimplePage('Oops...', render(deathTpl, { reason, coward }));
}

export function renderExpTableView(currentExp: number, currentLevel: number, flash: FlashMessage | null = null): string {
    const buildColumn = (start: number, end: number) => {
        const rows = [];
        for (let i = start; i <= end; i++) {
            const expReq = calculateExpForLevel(i);
            const rowClass = currentLevel === i ? 'row-current' : '';
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
    return renderSimplePage('Experience Table', content, flash);
}
