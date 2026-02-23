import { randomInt } from '../common/utils';
import { BattleResult, WeaponConfig } from '../common/types';

export const WEAPON_CONFIGS: WeaponConfig[] = [
    { orcs: [1, 2], hpLoss: [50, 55], exp: [50, 150], adena: [50, 90] },
    { orcs: [4, 7], hpLoss: [40, 45], exp: [150, 250], adena: [100, 290] },
    { orcs: [8, 12], hpLoss: [45, 50], exp: [250, 350], adena: [300, 690] },
    { orcs: [13, 18], hpLoss: [50, 55], exp: [350, 450], adena: [700, 1290] },
    { orcs: [19, 23], hpLoss: [45, 50], exp: [450, 550], adena: [1300, 5490] },
    { orcs: [36, 45], hpLoss: [40, 45], exp: [550, 650], adena: [5500, 14900] }
];

export function simulateBattle(weaponId: number, armorId: number, exp: number): BattleResult {
    const weaponConfig = WEAPON_CONFIGS[weaponId] || WEAPON_CONFIGS[0];

    const armorMitigation = armorId * 4;

    let orcsKilled = randomInt(weaponConfig.orcs[0], weaponConfig.orcs[1]);
    let hpLost = randomInt(weaponConfig.hpLoss[0], weaponConfig.hpLoss[1]) - randomInt(armorMitigation - 3, armorMitigation);
    let expGained = randomInt(weaponConfig.exp[0], weaponConfig.exp[1]);
    let adenaGained = randomInt(weaponConfig.adena[0], weaponConfig.adena[1]);

    if (exp >= 593760) {
        orcsKilled += randomInt(35, 44); hpLost -= randomInt(10, 12); expGained += randomInt(350, 500); adenaGained += randomInt(5000, 15000);
    } else if (exp >= 266240) {
        orcsKilled += randomInt(25, 34); hpLost -= randomInt(7, 9); expGained += randomInt(150, 350); adenaGained += randomInt(1500, 4000);
    } else if (exp >= 68320) {
        orcsKilled += randomInt(15, 24); hpLost -= randomInt(4, 6); expGained += randomInt(50, 150); adenaGained += randomInt(150, 400);
    } else if (exp >= 17960) {
        orcsKilled += randomInt(5, 14); hpLost -= randomInt(1, 3); expGained += randomInt(10, 50); adenaGained += randomInt(10, 40);
    }

    return { orcsKilled, hpLost: Math.max(1, hpLost), expGained, adenaGained };
}
