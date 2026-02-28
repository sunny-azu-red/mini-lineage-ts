import { readTemplate, render } from './base.view';
import { formatAdena, randomInt } from '../common/utils';
import { renderPage, renderSimplePage } from './layout';
import { PlayerState } from '../common/types';
import { HEROES } from '../common/data';

const gameStartTpl = readTemplate('game-start.ejs');
const homeTpl = readTemplate('home.ejs');

export function renderGameStartView(): string {
    return renderSimplePage('Game Start', render(gameStartTpl, { heroes: HEROES }));
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

        const hero = HEROES[player.heroId];
        helloMsg = `You have selected to be ${hero.emoji} ${hero.label}. Congratulations!<br>You are ${build} ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} adena.`;
    }

    const content = render(homeTpl, { helloMsg });
    return renderPage('Home Town', player, content);
}
