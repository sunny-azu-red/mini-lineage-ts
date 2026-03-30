-- Migration 003: Convert game stats to key-value store

-- 1. Rename old table
RENAME TABLE `game_stats` TO `game_stats_old`;

-- 2. Create new key-value table
CREATE TABLE `game_stats` (
    `stat_name` VARCHAR(64) NOT NULL,
    `stat_value` BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`stat_name`)
) ENGINE=InnoDB;

-- 3. Migrate data from old table to new table
INSERT INTO `game_stats` (`stat_name`, `stat_value`)
SELECT 'total_battles', IFNULL(`total_battles`, 0) FROM `game_stats_old` WHERE `id` = 1
UNION ALL
SELECT 'total_deaths', IFNULL(`total_deaths`, 0) FROM `game_stats_old` WHERE `id` = 1
UNION ALL
SELECT 'total_ambushes', IFNULL(`total_ambushes`, 0) FROM `game_stats_old` WHERE `id` = 1
UNION ALL
SELECT 'total_enemies_killed', IFNULL(`total_enemies_killed`, 0) FROM `game_stats_old` WHERE `id` = 1
UNION ALL
SELECT 'total_adena_generated', IFNULL(`total_adena_generated`, 0) FROM `game_stats_old` WHERE `id` = 1
UNION ALL
SELECT 'total_players', IFNULL(`total_players`, 0) FROM `game_stats_old` WHERE `id` = 1;

-- If the old table was empty or missing id=1, seed the default rows
INSERT IGNORE INTO `game_stats` (`stat_name`, `stat_value`) VALUES
('total_battles', 0),
('total_deaths', 0),
('total_ambushes', 0),
('total_enemies_killed', 0),
('total_adena_generated', 0),
('total_players', 0);

-- 4. Drop the old table
DROP TABLE `game_stats_old`;
