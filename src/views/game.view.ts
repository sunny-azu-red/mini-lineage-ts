import { readTemplate, render } from './base.view';
import { renderPage, renderSimplePage } from './layout.view';
import { PlayerState, FlashMessage } from '../common/types';
import { RACES } from '../common/data';

const gameStartTpl = readTemplate('game-start.ejs');
const homeTpl = readTemplate('home.ejs');

export function renderGameStartView(): string {
    const content = render(gameStartTpl, { races: RACES });

    return renderSimplePage('Game Start', content);
}

export function renderHomeView(player: PlayerState, flash: FlashMessage | null = null): string {
    const content = render(homeTpl);

    return renderPage('Home Town', player, content, flash);
}
