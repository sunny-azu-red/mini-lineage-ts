-- Migration 001: Initial schema

CREATE TABLE IF NOT EXISTS `highscores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `total_xp` int(11) NOT NULL,
  `race_id` int(11) NOT NULL,
  `adena` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
