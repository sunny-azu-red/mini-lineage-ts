import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { formatAdena, randomInt } from '../common/utils';
import { renderPage, renderSimplePage } from './layout';
import { PlayerState } from '../common/types';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const gameStartTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'game-start.ejs'), 'utf8');
const homeTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'home.ejs'), 'utf8');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}

export function renderGameStartView(): string {
    return renderSimplePage('Game Start', render(gameStartTpl, {}));
}

export function renderHomeView(player: PlayerState, isNewPlayer: boolean): string {
    let helloMsg = '';

    if (isNewPlayer) {
        const age = randomInt(10, 70);
        let definition = 'kid';
        if (age > 18 && age <= 50) definition = 'man';
        else if (age > 50) definition = 'old fart';
        helloMsg = `You have selected to be Human. Congratulations!<br>You are an average ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} adena.`;
    }

    const content = render(homeTpl, { helloMsg });
    return renderPage('Home Town', player, content);
}
