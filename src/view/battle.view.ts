import { readTemplate, render } from './base.view';
import { renderPage } from './layout.view';
import { PlayerState, BattleResult, FlashMessage } from '@/interface';
import { WEAPONS, ARMORS, RACES } from '@/constant/game.constant';
import { BATTLE_DEFLECTION_TEMPLATES, BATTLE_KILL_TEMPLATES, BATTLE_MOVES, BATTLE_OUTCOME_TEMPLATES, BATTLE_SURPRISE_TEMPLATES } from '@/constant/narratives.constant';
import { fillTemplate, formatAdena, randomElement, pluralize } from '@/util';
import { calculateSurpriseCount } from '@/service/math.service';

const battlegroundTpl = readTemplate('battleground.ejs');

export function renderBattlegroundView(player: PlayerState, results: BattleResult, flash: FlashMessage | null = null): string {
    const weapon = WEAPONS[player.weaponId];
    const armor = ARMORS[player.armorId];
    const enemies = results.enemiesKilled;

    // determine opponent based on the race's configured enemy
    const race = RACES[player.raceId];
    const opponentRace = RACES[race.enemyRaceId];
    const enemyEmoji = opponentRace.emoji;
    const enemyName = opponentRace.label;
    const enemyGroup = pluralize(opponentRace.label, opponentRace.plural, enemies, enemyEmoji);

    const templateData = {
        weaponEmoji: weapon.emoji,
        weaponName: weapon.name,
        armorEmoji: armor.emoji,
        armorName: armor.name,
        enemyGroup,
        enemyEmoji,
        enemyName,
        blocked: results.damageBlocked,
        xpGained: results.xpGained,
        adenaGained: formatAdena(results.adenaGained),
        hp: player.health,
        isSingleEnemy: enemies === 1,
    };

    const killText = fillTemplate(randomElement(BATTLE_KILL_TEMPLATES), templateData);
    const deflectionText = fillTemplate(randomElement(BATTLE_DEFLECTION_TEMPLATES), templateData);
    const outcomeText = fillTemplate(randomElement(BATTLE_OUTCOME_TEMPLATES), templateData);

    // surprises
    const surpriseEnemies = calculateSurpriseCount(enemies, 4);
    const surpriseEnemyGroup = pluralize(opponentRace.label, opponentRace.plural, surpriseEnemies, enemyEmoji);
    const surpriseData = {
        ...templateData,
        surpriseEnemyGroup,
        surpriseEnemyGroupCap: surpriseEnemyGroup.charAt(0).toUpperCase() + surpriseEnemyGroup.slice(1),
        isSingleSurprise: surpriseEnemies === 1
    };
    const surpriseText = fillTemplate(randomElement(BATTLE_SURPRISE_TEMPLATES), surpriseData);

    const content = render(battlegroundTpl, {
        battleText: `${killText} ${deflectionText}`,
        outcomeLine: outcomeText,
        ambushed: player.ambushed,
        ambushedMessage: surpriseText,
        fightText: surpriseEnemies === 1 ? `Face your Foe!` : `Fight them!`,
        nextMove: randomElement(BATTLE_MOVES),
    });

    return renderPage('Battleground', player, content, flash);
}
