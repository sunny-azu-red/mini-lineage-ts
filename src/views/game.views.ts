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
        const builds = ['a slim', 'a lean', 'an average', 'a fit', 'a stocky', 'a broad', 'a round'];
        const build = builds[randomInt(0, builds.length - 1)];
        const age = randomInt(9, 69);

        let definition = 'youth';
        if (age > 23 && age <= 54) {
            definition = 'adult';
        } else if (age > 54) {
            definition = 'elder';
        }

        helloMsg = `You have selected to be 👤 ${player.race}. Congratulations!<br>You are ${build} ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} adena.`;
    }

    const content = render(homeTpl, { helloMsg });
    return renderPage('Home Town', player, content);
}
