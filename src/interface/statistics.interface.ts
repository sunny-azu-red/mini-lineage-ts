export type StatField =
    | 'total_adena'
    | 'total_adena_generated'
    | 'total_adena_spent'
    | 'total_ambushes'
    | 'total_armors_bought'
    | 'total_battles'
    | 'total_damage_blocked'
    | 'total_deaths'
    | 'total_enemies_killed'
    | 'total_food_bought'
    | 'total_hp_healed'
    | 'total_hp_lost'
    | 'total_levels_gained'
    | 'total_players'
    | 'total_players_cheated'
    | 'total_players_suicided'
    | 'total_weapons_bought'
    | 'total_xp_gained';

export interface StatRow {
    name: StatField;
    value: number;
}

export type Statistics = {
    [K in StatField]: number;
};
