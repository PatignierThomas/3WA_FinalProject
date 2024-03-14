-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 14 mars 2024 à 14:59
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `forum`
--

-- --------------------------------------------------------

--
-- Structure de la table `avatar`
--

DROP TABLE IF EXISTS `avatar`;
CREATE TABLE IF NOT EXISTS `avatar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `src` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_image` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `game_section`
--

DROP TABLE IF EXISTS `game_section`;
CREATE TABLE IF NOT EXISTS `game_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_name` varchar(100) NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `minimal_age` int NOT NULL,
  `visibility` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `game_section`
--

INSERT INTO `game_section` (`id`, `game_name`, `description`, `minimal_age`, `visibility`) VALUES
(11, 'Événement', 'Réseaux sociaux, dans les jeux...', 13, 'Public'),
(12, 'ColorfullWorld', 'Un monde qui vous en met plein les yeux...', 13, 'Private'),
(13, 'PocBoy', '', 13, 'Private'),
(14, 'Underwatch', '', 13, 'Private'),
(15, 'LightSoul', '', 18, 'Private'),
(16, 'Annonces', 'Nouvelles sorties, trailer...', 13, 'Public');

-- --------------------------------------------------------

--
-- Structure de la table `image`
--

DROP TABLE IF EXISTS `image`;
CREATE TABLE IF NOT EXISTS `image` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `post_id` int DEFAULT NULL,
  `reply_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `image_post` (`post_id`),
  KEY `image_reply` (`reply_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `views` int NOT NULL DEFAULT '0',
  `sub_forum_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `sub_forum_id` (`sub_forum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `post`
--

INSERT INTO `post` (`id`, `title`, `content`, `creation_date`, `last_update`, `status`, `views`, `sub_forum_id`, `user_id`) VALUES
(8, 'Évenement 1.0', '<p>Hello world</p>', '2024-02-13 09:23:40', '2024-03-14 03:11:15', 'ok', 54, 10, 1),
(9, 'Bob post', '<p>Hello i was bob 2</p>', '2024-02-14 08:56:39', '2024-02-15 11:48:22', 'ok', 31, 9, 3),
(10, 'Admin post', '<p>Hello this is admin</p>', '2024-02-15 13:48:11', '2024-02-15 13:48:11', 'ok', 8, 9, 1),
(11, 'Most recent post', '<p>I\'m recent </p>', '2024-02-15 14:02:02', '2024-02-27 14:43:28', 'ok', 232, 9, 1),
(12, 'hello', '<p>hello</p>', '2024-02-15 15:16:27', '2024-02-15 15:16:27', 'ok', 22, 12, 1),
(14, 'test', '<p>est</p>', '2024-02-15 15:24:50', '2024-02-15 15:24:50', 'locked', 202, 9, 1),
(15, 'Test query', '<p>gfdsgsdfg</p>', '2024-02-16 11:28:48', '2024-02-16 11:28:48', 'ok', 54, 12, 1),
(16, 'No reply', '<p>no reply</p>', '2024-02-16 17:08:31', '2024-02-16 17:08:31', 'ok', 75, 9, 1),
(17, 'No reply 2', '<p>no reply 2 </p>', '2024-02-16 17:09:25', '2024-02-16 17:09:25', 'hidden', 8, 9, 1),
(18, 'Text Quill', '<p>test</p>', '2024-02-21 14:22:24', '2024-02-21 16:33:29', 'hidden', 67, 9, 1),
(24, 'Image added', '<p>gfdgfd</p>', '2024-02-23 11:14:04', '2024-02-23 12:38:44', 'ok', 28, 12, 1),
(25, 'Image added', '<p>gdhlkj</p>', '2024-02-23 13:00:25', '2024-02-23 14:01:10', 'ok', 98, 9, 1),
(29, 'Refacto', '<p>test</p>', '2024-02-27 14:52:26', '2024-03-14 14:25:06', 'ok', 53, 9, 1),
(33, 'I am allowed', '<p>test</p>', '2024-03-08 16:14:26', '2024-03-08 17:14:26', 'ok', 4, 17, 1),
(35, 'hello', '<p>first</p>', '2024-03-08 17:12:52', '2024-03-08 18:12:53', 'ok', 3, 16, 3),
(42, 'Test of time', '<p>test</p>', '2024-03-12 18:34:19', '2024-03-12 18:34:19', 'ok', 5, 12, 1);

-- --------------------------------------------------------

--
-- Structure de la table `post_reply`
--

DROP TABLE IF EXISTS `post_reply`;
CREATE TABLE IF NOT EXISTS `post_reply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `reply_date` datetime NOT NULL,
  `last_update` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `reply_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `post_reply`
--

INSERT INTO `post_reply` (`id`, `content`, `reply_date`, `last_update`, `status`, `post_id`, `user_id`) VALUES
(5, '<p>hello bob i reply test</p>', '2024-02-14 11:47:23', '2024-02-15 11:46:15', 'ok', 9, 1),
(14, '<p>I am another response</p>', '2024-02-15 09:48:01', '2024-02-15 11:46:56', 'ok', 9, 4),
(16, '<p>hello response</p>', '2024-02-15 13:51:23', '0000-00-00 00:00:00', 'ok', 10, 1),
(17, '<p>most recent response</p>', '2024-02-15 13:51:36', '0000-00-00 00:00:00', 'ok', 9, 1),
(18, '<p>test rep </p>', '2024-02-15 14:19:03', '2024-02-27 15:17:39', 'ok', 11, 1),
(19, '<p>yrdy</p>', '2024-02-15 15:24:34', '0000-00-00 00:00:00', 'ok', 12, 1),
(21, '<p>recent</p>', '2024-02-16 10:40:16', '0000-00-00 00:00:00', 'ok', 14, 3),
(22, '<p>please</p>', '2024-02-16 10:41:30', '0000-00-00 00:00:00', 'ok', 9, 3),
(23, '<p>First res</p>', '2024-02-16 11:29:08', '0000-00-00 00:00:00', 'ok', 15, 1),
(24, '<p>je suis caché</p>', '2024-02-16 15:09:11', '0000-00-00 00:00:00', 'hidden', 9, 1),
(25, '<p>coucou </p>', '2024-02-16 15:22:49', '0000-00-00 00:00:00', 'hidden', 14, 1),
(26, '<p>hello</p>', '2024-02-16 17:09:41', '0000-00-00 00:00:00', 'ok', 14, 1),
(33, '<p>hello</p>', '2024-02-21 14:14:40', '0000-00-00 00:00:00', 'ok', 15, 1),
(35, '<p>heeloo</p>', '2024-02-22 10:52:25', '0000-00-00 00:00:00', 'ok', 11, 3),
(36, '<p>my avatar  please</p>', '2024-02-22 10:54:19', '0000-00-00 00:00:00', 'ok', 11, 3),
(37, '<p>my avatar</p>', '2024-02-22 11:16:56', '0000-00-00 00:00:00', 'ok', 18, 3),
(45, '<p>hello</p>', '2024-02-22 13:16:01', '0000-00-00 00:00:00', 'ok', 18, 1),
(52, '<p>hrllo</p>', '2024-02-22 14:16:17', '0000-00-00 00:00:00', 'ok', 18, 1),
(53, '<p>hello</p>', '2024-02-22 14:18:49', '0000-00-00 00:00:00', 'ok', 18, 1),
(75, '<p><img src=\"http://localhost:9001/public/assets/img/post/18/1708634572750.jpg\"></p>', '2024-02-22 20:42:52', '0000-00-00 00:00:00', 'ok', 18, 1),
(81, '<p>hfgh</p>', '2024-02-23 09:49:59', '2024-02-23 11:25:26', 'ok', 11, 1),
(82, '<p>jhgj</p>', '2024-02-23 09:50:11', '2024-02-23 11:26:14', 'ok', 11, 1),
(86, '<p>hello test reply</p>', '2024-02-28 13:41:45', '0000-00-00 00:00:00', 'ok', 12, 1),
(89, '<p>test with image <img src=\"http://localhost:9001/public/assets/img/post/16/1709311877390.jpg\"></p>', '2024-03-01 16:51:17', '0000-00-00 00:00:00', 'ok', 16, 1),
(93, '<p>&lt;script&gt;alert(hacked)&lt;/script&gt;</p>', '2024-03-07 17:26:18', '2024-03-13 15:37:41', 'ok', 29, 3),
(94, '<p>hello</p>', '2024-03-07 17:27:20', '0000-00-00 00:00:00', 'ok', 25, 3),
(101, '<p>test</p>', '2024-03-12 17:35:31', '0000-00-00 00:00:00', 'ok', 42, 1),
(103, '<p>test</p>', '2024-03-12 18:37:47', '0000-00-00 00:00:00', 'ok', 12, 1),
(105, '<p>test</p>', '2024-03-12 19:41:04', '0000-00-00 00:00:00', 'ok', 25, 1),
(108, '<p>test</p>', '2024-03-12 19:46:49', '0000-00-00 00:00:00', 'ok', 25, 1),
(109, '<p>test</p>', '2024-03-12 19:48:40', '0000-00-00 00:00:00', 'ok', 25, 1),
(110, '<p>test</p>', '2024-03-12 19:50:38', '0000-00-00 00:00:00', 'ok', 25, 1),
(111, '<p>test</p>', '2024-03-12 19:51:02', '0000-00-00 00:00:00', 'ok', 25, 1),
(112, '<p>testV2</p>', '2024-03-12 19:53:25', '2024-03-12 21:42:38', 'ok', 25, 1),
(113, '<p>test</p>', '2024-03-12 21:07:22', '0000-00-00 00:00:00', 'ok', 25, 1),
(114, '<p>test</p>', '2024-03-12 21:08:12', '0000-00-00 00:00:00', 'ok', 25, 1),
(116, '<p>test</p>', '2024-03-12 21:11:59', '0000-00-00 00:00:00', 'ok', 25, 1),
(117, '<p>test</p>', '2024-03-12 21:17:55', '0000-00-00 00:00:00', 'ok', 25, 1),
(118, '<p><span class=\"ql-size-huge\">hrello<span class=\"ql-cursor\">﻿</span></span></p>', '2024-03-13 15:41:20', '0000-00-00 00:00:00', 'ok', 29, 1);

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `label`) VALUES
(1, 'user'),
(2, 'admin'),
(3, 'moderator'),
(4, 'developer');

-- --------------------------------------------------------

--
-- Structure de la table `sub_forum`
--

DROP TABLE IF EXISTS `sub_forum`;
CREATE TABLE IF NOT EXISTS `sub_forum` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(50) NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `game_section_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `game_section_id` (`game_section_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `sub_forum`
--

INSERT INTO `sub_forum` (`id`, `subject`, `status`, `description`, `game_section_id`) VALUES
(9, 'Général', 'ok', 'Discussion générale', 12),
(10, 'Annonces', 'ok', NULL, 11),
(12, 'Hors-Sujet', 'ok', NULL, 12),
(16, 'Général', 'ok', 'Un peu de tout...', 15),
(17, 'Test right', 'ok', 'this a test', 16);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `birthdate` date NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` char(60) NOT NULL,
  `account_creation_date` datetime NOT NULL,
  `account_status` varchar(20) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `birthdate`, `email`, `password`, `account_creation_date`, `account_status`, `role_id`) VALUES
(1, 'toto', '2000-01-01', 'test@gmail.com', '$2b$10$0n6r3H3T6aV0hQgk6BKWzOw5eUV1pqTqk2G2CkXFBraKtVbfH7KSK', '2024-02-02 08:57:39', 'ok', 2),
(2, 'test', '2000-01-02', 'test2@gmail.com', '$2b$10$bblSBS2d4RBKnmXW2nnH7ea6aGy1MDgYdxw8GBSN2XMAux.5xoxZi', '2024-02-02 09:04:29', 'ok', 1),
(3, 'bob', '1995-12-02', 'bob@test.com', '$2b$10$1SOxaL/fxt4ahyfw4nQ/8.JiYea20k5zLgKk1rDf6HC.dDUVma8ne', '2024-02-05 15:25:06', 'ok', 1),
(4, '<script>alert(\"hacked\")</script>', '2010-05-10', 'timmy@test.com', '$2b$10$t09osWzGQ/D6tMrlDSbvc.x0a05KQoA3vIZzDU/sZ7YNj71fMZXmu', '2024-02-06 13:16:46', 'ok', 1),
(5, 'BanMePls', '1998-02-08', 'ban@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'ok', 1),
(6, 'BanMePls2', '1998-02-08', 'ban2@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'ok', 1),
(7, 'BanMePls3', '1998-02-08', 'ban3@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'ok', 1),
(8, 'BanMePls4', '1998-02-08', 'ban4@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'ok', 1),
(9, 'BanMePls5', '1998-02-08', 'ban5@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'ok', 1),
(10, 'BanMePls6', '1998-02-08', 'ban6@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'ok', 1),
(11, 'BanMePls7', '1998-02-08', 'ban7@gmail.com', '$2b$10$5bIlE51AoYFFQxK/g56CWOsT2XeElahqxb1/Kby.6c4knFgKrb9pu', '2024-02-19 08:58:23', 'banned', 1);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `avatar`
--
ALTER TABLE `avatar`
  ADD CONSTRAINT `user_image` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `image_reply` FOREIGN KEY (`reply_id`) REFERENCES `post_reply` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `sub_forum_id` FOREIGN KEY (`sub_forum_id`) REFERENCES `sub_forum` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Contraintes pour la table `post_reply`
--
ALTER TABLE `post_reply`
  ADD CONSTRAINT `post_id` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reply_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Contraintes pour la table `sub_forum`
--
ALTER TABLE `sub_forum`
  ADD CONSTRAINT `game_section_id` FOREIGN KEY (`game_section_id`) REFERENCES `game_section` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
