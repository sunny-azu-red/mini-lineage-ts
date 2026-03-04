import { readTemplate, render } from './base.view';
import { renderPage } from './layout.view';
import { PlayerState, FlashMessage } from '@/interface';
import { WEAPONS, ARMORS, FOODS } from '@/constant/game.constant';
import { formatShopItems } from '@/util';

const weaponsShopTpl = readTemplate('weapons-shop.ejs');
const armorsShopTpl = readTemplate('armors-shop.ejs');
const innTpl = readTemplate('inn.ejs');

export function renderWeaponsShopView(player: PlayerState, flash: FlashMessage | null): string {
    const items = formatShopItems(WEAPONS.slice(1));
    const content = render(weaponsShopTpl, { items, player });

    return renderPage('Weapons Shop', player, content, flash);
}

export function renderArmorsShopView(player: PlayerState, flash: FlashMessage | null): string {
    const items = formatShopItems(ARMORS.slice(1));
    const content = render(armorsShopTpl, { items, player });

    return renderPage('Armor Shop', player, content, flash);
}

export function renderInnView(player: PlayerState, flash: FlashMessage | null): string {
    const items = formatShopItems(FOODS);
    const content = render(innTpl, { items, player });

    return renderPage('Inn', player, content, flash, { hideLowHealthAlert: true });
}
