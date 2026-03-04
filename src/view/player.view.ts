import { readTemplate, render } from './base.view';
import { renderPage, renderSimplePage } from './layout.view';
import { PlayerState, FlashMessage } from '@/interface';
import { calculateXpForLevel, getXpNeededToLevelUp } from '@/service/math.service';
import { MAX_LEVEL } from '@/constant/game.constant';
import { randomElement } from '@/util';
import { DEATH_MESSAGES } from '@/constant/narratives.constant';

const suicideTpl = readTemplate('suicide.ejs');
const deathTpl = readTemplate('death.ejs');
const xpTableTpl = readTemplate('xp-table.ejs');

export function renderSuicideView(player: PlayerState, flash: FlashMessage | null = null): string {
    const content = render(suicideTpl);

    return renderPage('Commit Suicide', player, content, flash, { hideLowHealthAlert: true });
}

export function renderDeathView(player: PlayerState): string {
    if (!player.deathReason) {
        if (player.coward) {
            player.deathReason = player.ambushed
                ? "🪤 You were caught trying to flee an ambush!"
                : "🤡 You took the cowardly way out.";
        } else {
            player.deathReason = randomElement(DEATH_MESSAGES);
        }
    }

    const content = render(deathTpl, {
        reason: player.deathReason,
        coward: player.coward
    });

    return renderPage('Game Over', player, content);
}

export function renderXpTableView(currentXp: number, currentLevel: number, flash: FlashMessage | null = null): string {
    const buildColumn = (start: number, end: number) => {
        const rows = [];
        for (let i = start; i <= end; i++) {
            const xpReq = calculateXpForLevel(i);
            const rowClass = currentLevel === i ? 'row-current' : '';
            rows.push({ level: i, xpReq, rowClass });
        }
        return rows;
    };

    const columns = [
        buildColumn(1, 20),
        buildColumn(21, 40),
        buildColumn(41, 60),
        buildColumn(61, 80),
    ];
    const xpNeeded = getXpNeededToLevelUp(currentXp);
    const content = render(xpTableTpl, { columns, currentXp, currentLevel, xpNeeded, maxLevel: MAX_LEVEL });

    return renderSimplePage('Experience Table', content, flash);
}
