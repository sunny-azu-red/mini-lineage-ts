-- Migration 002: Global statistics tracker (Key-Value format)

CREATE TABLE IF NOT EXISTS `statistics` (
    `name` VARCHAR(64) NOT NULL,
    `value` BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`name`)
) ENGINE=InnoDB;

-- Seed the initial stats
INSERT IGNORE INTO `statistics` (`name`, `value`) VALUES
('total_adena', 0),
('total_adena_generated', 0),
('total_adena_spent', 0),
('total_ambushes', 0),
('total_armors_bought', 0),
('total_battles', 0),
('total_damage_blocked', 0),
('total_deaths', 0),
('total_enemies_killed', 0),
('total_food_bought', 0),
('total_hp_healed', 0),
('total_hp_lost', 0),
('total_levels_gained', 0),
('total_players', 0),
('total_players_cheated', 0),
('total_players_suicided', 0),
('total_weapons_bought', 0),
('total_xp_gained', 0);
