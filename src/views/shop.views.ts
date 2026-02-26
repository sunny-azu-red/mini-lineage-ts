import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { renderPage } from './layout';
import { PlayerState } from '../common/types';
import { WEAPONS, ARMORS, FOODS } from '../common/data';
import { formatAdena } from '../common/utils';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const weaponsShopTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'weapons-shop.ejs'), 'utf8');
const armorsShopTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'armors-shop.ejs'), 'utf8');
const innTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'inn.ejs'), 'utf8');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}

export function renderWeaponsShopView(player: PlayerState, alertHtml: string): string {
    const weapons = WEAPONS.slice(1).map(w => ({
        name: w.name,
        stat: w.stat,
        costFormatted: formatAdena(w.cost),
    }));
    const content = render(weaponsShopTpl, { alertHtml, weapons });
    return renderPage('Weapons Shop', player, content);
}

export function renderArmorsShopView(player: PlayerState, alertHtml: string): string {
    const armors = ARMORS.slice(1).map(a => ({
        name: a.name,
        stat: a.stat,
        costFormatted: formatAdena(a.cost),
    }));
    const content = render(armorsShopTpl, { alertHtml, armors });
    return renderPage('Armor Shop', player, content);
}

export function renderInnView(player: PlayerState, alertHtml: string): string {
    const foods = FOODS.map(f => ({
        name: f.name,
        stat: f.stat,
        costFormatted: formatAdena(f.cost),
    }));
    const content = render(innTpl, { alertHtml, foods });
    return renderPage('Inn', player, content);
}
