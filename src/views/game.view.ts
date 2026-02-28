import { readTemplate, render } from './base.view';
import { renderPage, renderSimplePage } from './layout.view';
import { PlayerState, FlashMessage } from '../common/types';
import { HEROES } from '../common/data';

const gameStartTpl = readTemplate('game-start.ejs');
const homeTpl = readTemplate('home.ejs');

export function renderGameStartView(): string {
    return renderSimplePage('Game Start', render(gameStartTpl, { heroes: HEROES }));
}

export function renderHomeView(player: PlayerState, flash: FlashMessage | null = null): string {
    return renderPage('Home Town', player, render(homeTpl), flash);
}
