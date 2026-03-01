-- Mini-Lineage Database Dump
CREATE TABLE IF NOT EXISTS `highscores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `total_exp` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `race_id` int(11) NOT NULL,
  `adena` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERT INTO `highscores` (`total_exp`, `name`, `race_id`, `adena`, `level`, `created`) VALUES
-- (1000, 'Sunny', 0, 500, 5, NOW()),
-- (1500, 'Orc Slayer', 1, 800, 7, NOW());
