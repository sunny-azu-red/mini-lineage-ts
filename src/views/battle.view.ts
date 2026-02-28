import { readTemplate, render } from './base.view';
import { renderPage } from './layout.view';
import { PlayerState, BattleResult, FlashMessage } from '../common/types';
import { WEAPONS, ARMORS, HEROES } from '../common/data';
import { formatAdena, randomInt } from '../common/utils';

const battlegroundTpl = readTemplate('battleground.ejs');

export function renderBattlegroundView(player: PlayerState, results: BattleResult, flash: FlashMessage | null = null): string {
    const weapon = WEAPONS[player.weaponId];
    const armor = ARMORS[player.armorId];
    const weaponName = weapon.name;
    const weaponEmoji = weapon.emoji;
    const armorName = armor.name;
    const armorEmoji = armor.emoji;
    const blocked = results.damageBlocked;
    const enemies = results.enemiesKilled;

    // Determine opponent based on hero's configured enemy
    const hero = HEROES[player.heroId];
    const opponentHero = HEROES[hero.enemyHeroId];
    const enemyEmoji = opponentHero.emoji;
    const enemyName = enemies === 1 ? opponentHero.label : `${opponentHero.label}s`;

    // Weapon / kill line
    const killLines = [
        `Wielding your ${weaponEmoji} ${weaponName} with fury, you cut down ${enemies} ${enemyEmoji} ${enemyName}.`,
        `Your ${weaponEmoji} ${weaponName} cleaves through the battlefield, slaying ${enemies} ${enemyEmoji} ${enemyName}.`,
        `With a fierce war cry you lunge forward, striking down ${enemies} ${enemyEmoji} ${enemyName} with your ${weaponEmoji} ${weaponName}.`,
        `The ${enemies} ${enemyEmoji} ${enemyName} stood no chance, your ${weaponEmoji} ${weaponName} ended ${enemies === 1 ? 'its' : 'their'} life${enemies === 1 ? '' : 's'} swiftly.`,
    ];
    const killLine = killLines[randomInt(0, killLines.length - 1)];

    // Armor deflection line (only meaningful if armor blocked something)
    const armorLines = [
        `Your ${armorEmoji} ${armorName} absorbed a total of <span class="muted">${blocked} dmg</span> but you still learned from the clash, earning <span class="xp">${results.expGained} xp</span>.`,
        `The ${armorEmoji} ${armorName} held firm, deflecting <span class="muted">${blocked} dmg</span> and the narrow escape nets you <span class="xp">${results.expGained} xp</span>.`,
        `Blades glanced off your ${armorEmoji} ${armorName} for <span class="muted">${blocked} dmg</span> and you mastered your defense, granting <span class="xp">${results.expGained} xp</span>.`,
        `Your ${armorEmoji} ${armorName} took the brunt of <span class="muted">${blocked} dmg</span> yet you grow tougher from the blow, gaining <span class="xp">${results.expGained} xp</span>.`,
    ];
    const armorLine = armorLines[randomInt(0, armorLines.length - 1)];

    const battleText = [killLine, armorLine].filter(Boolean).join(' ');

    // HP outcome line
    const outcomeLines = [
        `You limp away with <span class="hp">${player.health} hp</span> remaining and <span class="gold">${formatAdena(results.adenaGained)} adena</span> to show for it.`,
        `The skirmish leaves you at <span class="hp">${player.health} hp</span>, but richer by <span class="gold">${formatAdena(results.adenaGained)} adena</span>.`,
        `Breathing heavily, you stand with <span class="hp">${player.health} hp</span> left and pocket <span class="gold">${formatAdena(results.adenaGained)} adena</span>.`,
    ];
    const outcomeLine = outcomeLines[randomInt(0, outcomeLines.length - 1)];

    const surprises = [
        `Out of the blue 3 ${enemyEmoji} ${enemyName} surrounded you and you can't escape.`,
        `You forgot to check your back and you get stormed by 6 ${enemyEmoji} ${enemyName}.`,
        `You find yourself in a delicate position, the ${enemyEmoji} ${enemyName} leader has come with reinforcements.`,
        `As you were walking along 4 ${enemyEmoji} ${enemyName} jumped out of the bushes.`,
        `You reached a dead-end and you find yourself cornered by 3 ${enemyEmoji} ${enemyName}.`,
    ];
    const moves = [
        'Look behind the tree',
        'Walk further',
        'Check the cave',
        'Jump in the bushes',
        'Look behind',
        'Run up the hill',
        'Enter the old house',
        'Enter the abandoned town',
        'Scream you want more action',
        'Check out the ruins',
        'Open the locked tower'
    ];

    const content = render(battlegroundTpl, {
        battleText,
        outcomeLine,
        ambushed: player.ambushed,
        ambushedMessage: surprises[randomInt(0, surprises.length - 1)],
        nextMove: moves[randomInt(0, moves.length - 1)],
    }, 'battleground.ejs');

    return renderPage('Battleground', player, content, flash);
}
