import { Item, Race } from '@/interface';
import { getVersion } from '@/util';

export const GAME_VERSION = getVersion();
export const REPO_COMMIT_URL = 'https://github.com/sunny-azu-red/mini-lineage-ts/commit/';

export const MAX_LEVEL = 80;

export const RACES: Race[] = [
    { id: 0, label: 'Human', plural: 'Humans', emoji: '🧙', enemyRaceId: 1, startHealth: 100, startAdena: 300, ambushOdds: 12 },
    { id: 1, label: 'Orc', plural: 'Orcs', emoji: '🧟', enemyRaceId: 0, startHealth: 150, startAdena: 250, ambushOdds: 6 },
    { id: 2, label: 'Elf', plural: 'Elves', emoji: '🧝', enemyRaceId: 3, startHealth: 75, startAdena: 450, ambushOdds: 25 },
    { id: 3, label: 'Dark Elf', plural: 'Dark Elves', emoji: '🧛', enemyRaceId: 2, startHealth: 85, startAdena: 350, ambushOdds: 20 },
];

/**
 * Item Data Configurations
 * 
 * Game combat math (HP lost, Enemies killed, XP and Adena gained) scales 
 * dynamically based solely on the `stat` property of the equipped Weapon and Armor.
 * 
 * You can seamlessly add new Items to the end of these arrays without breaking 
 * the game engine, provided the `stat` roughly follows the established scaling curve.
 */
export const ARMORS: Item[] = [
    { id: 0, name: `Peasant's Tunic`, emoji: '🧥', stat: 2, cost: 0 }, // start item
    { id: 1, name: `Brigandine Leathers`, emoji: '🥋', stat: 10, cost: 500 },
    { id: 2, name: `Spirit of the Forest`, emoji: '🪵', stat: 22, cost: 8_000 },
    { id: 3, name: `Knight's Plate`, emoji: '🛡️', stat: 41, cost: 30_000 },
    { id: 4, name: `Royal Chainmail`, emoji: '⛓️', stat: 64, cost: 140_000 },
    { id: 5, name: `Eternal Aegis`, emoji: '💎', stat: 88, cost: 400_000 },
];

export const WEAPONS: Item[] = [
    { id: 0, name: `Brawler's Fists`, emoji: '👊', stat: 7, cost: 0 }, // start item
    { id: 1, name: `Elven Needle`, emoji: '🗡️', stat: 16, cost: 300 },
    { id: 2, name: `Stormbringer`, emoji: '⚡', stat: 28, cost: 5_000 },
    { id: 3, name: `Echos of Valhalla`, emoji: '⚔️', stat: 45, cost: 18_000 },
    { id: 4, name: `Calamity Comet`, emoji: '☄️', stat: 62, cost: 160_000 },
    { id: 5, name: `The Forgotten Blade`, emoji: '💀', stat: 90, cost: 600_000 },
];

export const FOODS: Item[] = [
    { id: 0, name: 'Spiced Ale', emoji: '🍺', stat: 4, cost: 7 },
    { id: 1, name: 'Forest Apple', emoji: '🍎', stat: 6, cost: 11 },
    { id: 2, name: 'Smoked Sausage', emoji: '🌭', stat: 15, cost: 29 },
    { id: 3, name: 'Hearty Mash', emoji: '🥔', stat: 25, cost: 57 },
    { id: 4, name: 'Roasted Pheasant', emoji: '🍗', stat: 50, cost: 137 },
];
