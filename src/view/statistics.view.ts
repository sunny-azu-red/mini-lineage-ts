import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { formatAdena, pluralize, formatNumber, fillTemplate } from '@/util';
import { Statistics } from '@/interface';

const statisticsTpl = readTemplate('statistics.ejs');

export function renderStatisticsView(stats: Statistics | null): string {
    let formattedStats = null;

    if (stats) {
        formattedStats = {
            ...stats,
            total_xp_gained_formatted: formatNumber(stats.total_xp_gained),
            total_hp_lost_formatted: formatNumber(stats.total_hp_lost),
            total_damage_blocked_formatted: formatNumber(stats.total_damage_blocked),
            total_hp_healed_formatted: formatNumber(stats.total_hp_healed),
            total_hp_regen_formatted: formatNumber(stats.total_hp_regen),
            total_adena_generated_formatted: formatAdena(stats.total_adena_generated),
            total_adena_spent_formatted: formatAdena(stats.total_adena_spent),
            total_adena_formatted: formatAdena(stats.total_adena),
        };
    }

    const content = render(statisticsTpl, {
        stats: formattedStats,
        pluralize,
        fillTemplate
    });

    return renderSimplePage('The Tome of Lore', content);
}
