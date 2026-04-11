-- Migration 003: Highscore upgrade limits

ALTER TABLE `highscores`
    MODIFY COLUMN `name` varchar(64) NOT NULL,
    MODIFY COLUMN `total_xp` bigint(20) NOT NULL,
    MODIFY COLUMN `adena` bigint(20) NOT NULL,
    MODIFY COLUMN `level` bigint(20) NOT NULL;
