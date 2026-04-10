import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { formatAdena } from '@/util';
import { Statistics } from '@/interface';

const statisticsTpl = readTemplate('statistics.ejs');

export function renderStatisticsView(stats: Statistics): string {
    const content = render(statisticsTpl, {
        stats: {
            total_adena: formatAdena(stats.total_adena),
            total_adena_generated: formatAdena(stats.total_adena_generated),
            total_adena_spent: formatAdena(stats.total_adena_spent),
            total_ambushes: stats.total_ambushes.toLocaleString(),
            total_armors_bought: stats.total_armors_bought.toLocaleString(),
            total_battles: stats.total_battles.toLocaleString(),
            total_damage_blocked: stats.total_damage_blocked.toLocaleString(),
            total_deaths: stats.total_deaths.toLocaleString(),
            total_enemies_killed: stats.total_enemies_killed.toLocaleString(),
            total_food_bought: stats.total_food_bought.toLocaleString(),
            total_hp_healed: stats.total_hp_healed.toLocaleString(),
            total_hp_lost: stats.total_hp_lost.toLocaleString(),
            total_levels_gained: stats.total_levels_gained.toLocaleString(),
            total_players: stats.total_players.toLocaleString(),
            total_players_cheated: stats.total_players_cheated.toLocaleString(),
            total_players_suicided: stats.total_players_suicided.toLocaleString(),
            total_weapons_bought: stats.total_weapons_bought.toLocaleString(),
            total_xp_gained: stats.total_xp_gained.toLocaleString(),
        }
    });

    return renderSimplePage('The Legacy of the Realm', content);
}
