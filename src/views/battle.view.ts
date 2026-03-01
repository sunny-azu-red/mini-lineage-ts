import { readTemplate, render } from './base.view';
import { renderPage } from './layout.view';
import { PlayerState, BattleResult, FlashMessage } from '../common/types';
import { WEAPONS, ARMORS, RACES } from '../common/data';
import { formatAdena, randomElement, pluralize } from '../common/utils';
import { calculateSurpriseCount } from '../services/math.service';

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

    // determine opponent based on the race's configured enemy
    const race = RACES[player.raceId];
    const opponentRace = RACES[race.enemyRaceId];
    const enemyEmoji = opponentRace.emoji;
    const enemyName = opponentRace.label;
    const enemyGroup = pluralize(opponentRace, enemies, enemyEmoji);

    // weapon + kills
    const killLines = [
        `Wielding your ${weaponEmoji} ${weaponName} with fury, you cut down ${enemyGroup}.`,
        `Your ${weaponEmoji} ${weaponName} cleaves through the battlefield, slaying ${enemyGroup}.`,
        `With a fierce war cry you lunge forward, striking down ${enemyGroup} with your ${weaponEmoji} ${weaponName}.`,
        `The ${enemyGroup} stood no chance, your ${weaponEmoji} ${weaponName} ended ${enemies === 1 ? 'its' : 'their'} ${enemies === 1 ? 'life' : 'lives'} swiftly.`,
        `A lethal dance of your ${weaponEmoji} ${weaponName} leaves fallen ${enemyGroup} in your wake.`,
        `Your strike is true; the ${weaponEmoji} ${weaponName} finds its mark against ${enemyGroup}.`,
    ];

    // armor + deflections + xp
    const deflectionLines = [
        `Your ${armorEmoji} ${armorName} absorbed a total of <span class="muted">${blocked} Damage</span> but you still learned from the clash, earning <span class="xp">${results.expGained} XP</span>.`,
        `The ${armorEmoji} ${armorName} held firm, deflecting <span class="muted">${blocked} Damage</span> and the narrow escape nets you <span class="xp">${results.expGained} XP</span>.`,
        `Blades glanced off your ${armorEmoji} ${armorName} for <span class="muted">${blocked} Damage</span> and you mastered your defense, granting <span class="xp">${results.expGained} XP</span>.`,
        `Your ${armorEmoji} ${armorName} took the brunt of <span class="muted">${blocked} Damage</span> yet you grow tougher from the blow, gaining <span class="xp">${results.expGained} XP</span>.`,
        `Steel rings against your ${armorEmoji} ${armorName}, mitigating <span class="muted">${blocked} Damage</span> as you refine your combat stance for <span class="xp">${results.expGained} XP</span>.`,
    ];

    // outcomes
    const outcomeLines = [
        `You limp away with <span class="hp">${player.health} HP</span> remaining and <span class="gold">${formatAdena(results.adenaGained)} Adena</span> to show for it.`,
        `The skirmish leaves you at <span class="hp">${player.health} HP</span>, but richer by <span class="gold">${formatAdena(results.adenaGained)} Adena</span>.`,
        `Breathing heavily, you stand with <span class="hp">${player.health} HP</span> left and pocket <span class="gold">${formatAdena(results.adenaGained)} Adena</span>.`,
    ];

    // surprises
    const surpriseEnemies = calculateSurpriseCount(enemies, 4);
    const surpriseEnemyGroup = pluralize(opponentRace, surpriseEnemies, enemyEmoji);
    const surprises = [
        `Out of the blue ${surpriseEnemyGroup} ${surpriseEnemies === 1 ? 'surrounds' : 'surround'} you and you can't escape.`,
        `You forgot to check your back and you get stormed by ${surpriseEnemyGroup}.`,
        `You find yourself in a delicate position, the ${enemyEmoji} ${enemyName} leader has come with reinforcements.`,
        `As you were walking along ${surpriseEnemyGroup} jumped out of the bushes.`,
        `You reached a dead-end and while turning around, you find yourself cornered by ${surpriseEnemyGroup}.`,
        `The ground trembles! Suddenly, ${surpriseEnemyGroup} ${surpriseEnemies === 1 ? 'stands' : 'stand'} before you!`,
        `An arrow whistles past your ear... ambush! ${surpriseEnemyGroup.charAt(0).toUpperCase() + surpriseEnemyGroup.slice(1)} ${surpriseEnemies === 1 ? 'emerges' : 'emerge'} from the shadows!`,
    ];

    // moves
    const moves = [
        'Investigate the shimmering lake',
        'Search the hollow log',
        'Follow the muddy tracks',
        'Scale the castle walls',
        'Descend into the dungeon',
        'Cross the rickety bridge',
        'Examine the mossy statue',
        'Explore the foggy marsh',
        'Consult the ancient map',
        'Drink from the stone fountain',
        'Sharpen your blade',
        'Prepare for an ambush',
        'Challenge the wandering guard',
        `Scout the enemy encampment`,
        'Rally your strength',
        'Set a trap in the brush',
        'Whisper a prayer to the Gods',
        'Search the fallen soldier',
        'Rest by the dying embers',
        'Scribe a note for those to follow'
    ];

    const content = render(battlegroundTpl, {
        battleText: [randomElement(killLines), randomElement(deflectionLines)].filter(Boolean).join(' '),
        outcomeLine: randomElement(outcomeLines),
        ambushed: player.ambushed,
        ambushedMessage: randomElement(surprises),
        fightText: surpriseEnemies === 1 ? `Face your Foe!` : `Fight them!`,
        nextMove: randomElement(moves),
    });

    return renderPage('Battleground', player, content, flash);
}
