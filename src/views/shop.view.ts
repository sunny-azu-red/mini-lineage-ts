import { readTemplate, render } from './base.view';
import { renderPage } from './layout.view';
import { PlayerState } from '../common/types';
import { WEAPONS, ARMORS, FOODS } from '../common/data';
import { formatAdena } from '../common/utils';

const weaponsShopTpl = readTemplate('weapons-shop.ejs');
const armorsShopTpl = readTemplate('armors-shop.ejs');
const innTpl = readTemplate('inn.ejs');

export function renderWeaponsShopView(player: PlayerState, alertHtml: string): string {
    const weapons = WEAPONS.slice(1).map(w => ({
        emoji: w.emoji,
        name: w.name,
        stat: w.stat,
        costFormatted: formatAdena(w.cost),
    }));
    const selectWeapons = WEAPONS.slice(1).map(w => ({ id: w.id, emoji: w.emoji, name: w.name }));
    const content = render(weaponsShopTpl, { alertHtml, weapons, selectWeapons });
    return renderPage('Weapons Shop', player, content);
}

export function renderArmorsShopView(player: PlayerState, alertHtml: string): string {
    const armors = ARMORS.slice(1).map(a => ({
        emoji: a.emoji,
        name: a.name,
        stat: a.stat,
        costFormatted: formatAdena(a.cost),
    }));
    const selectArmors = ARMORS.slice(1).map(a => ({ id: a.id, emoji: a.emoji, name: a.name }));
    const content = render(armorsShopTpl, { alertHtml, armors, selectArmors });
    return renderPage('Armor Shop', player, content);
}

export function renderInnView(player: PlayerState, alertHtml: string): string {
    const foods = FOODS.map(f => ({
        emoji: f.emoji,
        name: f.name,
        stat: f.stat,
        costFormatted: formatAdena(f.cost),
    }));
    const selectFoods = FOODS.map(f => ({ id: f.id, emoji: f.emoji, name: f.name }));
    const content = render(innTpl, { alertHtml, foods, selectFoods });
    return renderPage('Inn', player, content, { hideLowHealthAlert: true });
}
