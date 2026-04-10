import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { formatAdena, pluralize, formatNumber, fillTemplate } from '@/util';
import { Statistics } from '@/interface';

const statisticsTpl = readTemplate('statistics.ejs');

export function renderStatisticsView(stats: Statistics): string {
    const formattedStats = {
        ...stats,
        total_players_formatted: formatNumber(stats.total_players),
        total_levels_gained_formatted: formatNumber(stats.total_levels_gained),
        total_deaths_formatted: formatNumber(stats.total_deaths),
        total_players_suicided_formatted: formatNumber(stats.total_players_suicided),
        total_players_cheated_formatted: formatNumber(stats.total_players_cheated),
        total_battles_formatted: formatNumber(stats.total_battles),
        total_enemies_killed_formatted: formatNumber(stats.total_enemies_killed),
        total_xp_gained_formatted: formatNumber(stats.total_xp_gained),
        total_ambushes_formatted: formatNumber(stats.total_ambushes),
        total_hp_lost_formatted: formatNumber(stats.total_hp_lost),
        total_damage_blocked_formatted: formatNumber(stats.total_damage_blocked),
        total_hp_healed_formatted: formatNumber(stats.total_hp_healed),
        total_food_bought_formatted: formatNumber(stats.total_food_bought),
        total_weapons_bought_formatted: formatNumber(stats.total_weapons_bought),
        total_armors_bought_formatted: formatNumber(stats.total_armors_bought),
        total_adena_generated_formatted: formatAdena(stats.total_adena_generated),
        total_adena_spent_formatted: formatAdena(stats.total_adena_spent),
        total_adena_formatted: formatAdena(stats.total_adena),
    };

    const content = render(statisticsTpl, {
        stats: formattedStats,
        pluralize,
        fillTemplate
    });

    return renderSimplePage('The Tome of Lore', content);
}
