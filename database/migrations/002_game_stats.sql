-- Migration 002: Global game stats tracker

CREATE TABLE IF NOT EXISTS `game_stats` (
    `id` INT NOT NULL DEFAULT 1,
    `total_battles` BIGINT NOT NULL DEFAULT 0,
    `total_deaths` BIGINT NOT NULL DEFAULT 0,
    `total_ambushes` BIGINT NOT NULL DEFAULT 0,
    `total_escapes` BIGINT NOT NULL DEFAULT 0,
    `total_enemies_killed` BIGINT NOT NULL DEFAULT 0,
    `total_adena_generated` BIGINT NOT NULL DEFAULT 0,
    `total_players` BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Seed the single stats row
INSERT IGNORE INTO `game_stats` (`id`) VALUES (1);
