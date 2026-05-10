import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { PlayerState } from '@/interface';
import { RACES } from '@/constant/game.constant';
import { RACE_TRAITS_TEMPLATES } from '@/constant/narratives.constant';
import { formatNumber, formatAdena, fillTemplate } from '@/util/format.util';

const racesTpl = readTemplate('races.ejs');

export function renderRacesView(player: PlayerState | null = null): string {
    const formattedRaces = RACES.map(race => {
        return {
            ...race,
            traits: fillTemplate(RACE_TRAITS_TEMPLATES[race.id], {
                hp: formatNumber(race.startHealth),
                adena: formatAdena(race.startAdena),
                crit: formatNumber(race.crit),
                regen: formatNumber(race.regen),
                ambush: formatNumber(race.ambushChance)
            })
        };
    });

    const content = render(racesTpl, {
        races: formattedRaces
    });

    return renderSimplePage('Chronicles of Ancestry', content, null, player);
}
