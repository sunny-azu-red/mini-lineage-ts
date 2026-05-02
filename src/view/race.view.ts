import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { PlayerState } from '@/interface';
import { RACES } from '@/constant/game.constant';
import { formatNumber, formatAdena } from '@/util';

const racesTpl = readTemplate('races.ejs');

export function renderRacesView(player: PlayerState | null = null): string {
    const formattedRaces = RACES.map(race => ({
        ...race,
        startHealthFormatted: formatNumber(race.startHealth),
        startAdenaFormatted: formatAdena(race.startAdena),
        critFormatted: formatNumber(race.crit),
        regenFormatted: formatNumber(race.regen),
        ambushRiskFormatted: formatNumber(Number((100 / race.ambushOdds).toFixed(2)))
    }));

    const content = render(racesTpl, {
        races: formattedRaces
    });

    return renderSimplePage('Chronicles of Ancestry', content, null, player);
}
