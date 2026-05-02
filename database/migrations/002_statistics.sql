-- Migration 002: Global statistics tracker (Key-Value format)

CREATE TABLE IF NOT EXISTS `statistics` (
    `name` VARCHAR(64) NOT NULL,
    `value` BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`name`)
) ENGINE=InnoDB;
