import { PlayerState, Hero } from '../common/types';
import { HEROES } from '../common/data';

export function initializePlayer(player: PlayerState, hero: Hero): void {
    player.race = hero.race;
    player.health = hero.startHealth;
    player.adena = hero.startAdena;
    player.experience = 0;
    player.weaponId = 0;
    player.armorId = 0;
    player.welcomed = false;
}

export function deductCost(player: PlayerState, cost: number): boolean {
    if (player.adena < cost)
        return false;

    player.adena -= cost;
    return true;
}

export function restoreHealth(player: PlayerState, amount: number): void {
    const maxHp = HEROES[player.race].startHealth;
    player.health = Math.min(maxHp, player.health + amount);
}

export function applyBattleResult(player: PlayerState, hpLost: number, expGained: number, adenaGained: number): void {
    player.health -= hpLost;
    player.experience += expGained;
    player.adena += adenaGained;

    if (player.health <= 0)
        player.dead = true;
    // player.health = 100; // DEBUG: respawn on death
}

// TODO: is the race enum really necessary? cant we have heroes with 1, 2, 3 like items?
// TODO: also, we should specify the enemy hero in each hero object
// TODO: so that we can add elves and gnomes and other races if we wish

// TODO: make it that if we dont have enough money, it shows a red flash message, not a separate page with go back
// TODO: make it so that you cant buy armor or weapon if you already have the exact one, the option should be disabled in the list
// TODO: can we animate the health bar and xp bar? perhaps save the previous hp or xp in session and when you refresh the page, show the previous hp and xp but then animate to the actual hp and xp
// TODO: and on that note maybe the bar labels should be animated too?
// TODO: <div class="alert alert-success">🎉 Congratulations! You have reached level <%= newLevel %>.</div> should not be green but golden, simulate the lineage level up
// TODO: the surprises should be 25% of enemies you previously killed (enemiesKilled / 4)
// TODO: more text versions for the battleground
// TODO: i dont like the *.views.ts files, that logic can go in the controller and the controller should call .ejs or should that logic go into .ejs?
// TODO: the render function is repeating alot of times
// TODO: dry the code and ask for improvements
