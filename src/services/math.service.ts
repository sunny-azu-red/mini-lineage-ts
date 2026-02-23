export function calculateExpForLevel(level: number): number {
    return level <= 1 ? 0 : Math.round(130 * Math.pow(level, 2) + 130 * level);
}

export function calculateLevel(exp: number): number {
    let level = 1;
    while (level < 80 && calculateExpForLevel(level + 1) <= exp)
        level++;
    return level;
}
