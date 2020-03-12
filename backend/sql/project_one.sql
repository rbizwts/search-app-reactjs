-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2019 at 02:07 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.1.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_one`
--

-- --------------------------------------------------------

--
-- Table structure for table `catalogue`
--

CREATE TABLE `catalogue` (
  `id` int(11) NOT NULL,
  `category` enum('DEFINITION','PROJECTS','STACK','PM','DEVELOPERS','REFS') NOT NULL DEFAULT 'DEFINITION',
  `description` varchar(255) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `is_tag_search_only` enum('YES','NO') NOT NULL DEFAULT 'NO',
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `catalogue`
--

INSERT INTO `catalogue` (`id`, `category`, `description`, `tags`, `is_tag_search_only`, `status`, `created_at`, `updated_at`) VALUES
(1, 'DEFINITION', 'React js is Javascript Framework.', 'react', 'NO', 'ACTIVE', '2019-09-13 08:08:29', '2019-09-24 12:05:17'),
(2, 'DEFINITION', 'React Native is an open-source mobile application framework', 'reactnative', 'NO', 'ACTIVE', '2019-09-13 10:06:20', '2019-09-13 10:06:20'),
(3, 'DEFINITION', 'Nuclear reactors are used at nuclear power plants for electricity generation', 'react, LIfecycle', 'NO', 'ACTIVE', '2019-09-13 10:11:39', '2019-09-19 13:22:18'),
(60, 'PM', 'new react PM', 'pm', 'YES', 'ACTIVE', '2019-09-16 11:46:49', '2019-09-16 11:46:49'),
(65, 'STACK', 'Test 2', '', 'NO', 'ACTIVE', '2019-09-23 06:25:50', '2019-09-23 06:25:56'),
(95, 'DEVELOPERS', 'Test 3', '', 'NO', 'ACTIVE', '2019-09-23 06:50:26', '2019-09-23 06:50:26'),
(96, 'REFS', 'Test 4', '', 'NO', 'ACTIVE', '2019-09-23 06:50:31', '2019-09-23 06:50:31'),
(97, 'PROJECTS', 'The array or object must contain all bound values or Sequelize will throw an exception. This applies even to cases in which the database may ignore the bound parameter.', '', 'NO', 'ACTIVE', '2019-09-23 06:52:14', '2019-09-23 06:52:14'),
(98, 'STACK', ' cases where you don\'t need to access the metadata you can pass in a q', '', 'NO', 'ACTIVE', '2019-09-23 06:52:23', '2019-09-23 06:52:23'),
(99, 'PM', 'The array or object must contain all bound values or Sequelize will throw an exception. This applies even to cases in which the database may ignore the bound parameter.', '', 'NO', 'ACTIVE', '2019-09-23 06:52:26', '2019-09-23 06:52:26'),
(100, 'DEVELOPERS', 'A second option is the model. If you pass a model the returned data will be instances of that model.', '', 'NO', 'ACTIVE', '2019-09-23 06:52:30', '2019-09-23 06:52:30'),
(101, 'REFS', 'See more options in the query API reference. Some examples below:\r\n\r\n', 'f', 'NO', 'ACTIVE', '2019-09-23 06:52:34', '2019-09-23 06:52:41'),
(103, 'DEFINITION', 'React', '', 'NO', 'ACTIVE', '2019-09-24 04:50:04', '2019-09-24 04:50:04'),
(104, 'PROJECTS', 'New 2', '', 'NO', 'ACTIVE', '2019-09-24 04:50:11', '2019-09-24 04:50:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `name`, `email`, `password`, `salt`, `created_at`, `updated_at`) VALUES
(1, 'shirish', 'Shirish Makwana', 'shirish.m@wingstechsolutions.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 12:56:34'),
(8, 'pankaj', 'Pankaj Makwana', 'pankaj@wts.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 12:10:33'),
(11, 'mitesh', 'Mitesh Chavda', 'mitesh@wts.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 12:11:35'),
(17, 'sanjay', 'Sanjay Seju', 'sanjay@wts.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 12:56:55'),
(19, 'nikunj', 'Nikunj D', 'nikunj@wts.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 12:22:17'),
(20, 'jay', 'Jay M', 'jay@wts.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 13:00:41'),
(25, 'ketan', 'Ketan Modha', 'ketan@wts.com', '87411c97180390f3fc2a51753c261153a183c4145ea863a2b6d9d8a70a4bcb82', 'lIjbqBCexbp4CUBkGA8y+Q==', NULL, '2019-09-20 12:56:28'),
(39, NULL, 'RM', 'ravi@wts.com', 'd0180937623cebd5a57e29ba907bcf8dbe8ffc6a437d89b62e7c7f889cbb62f2', '32wMI11i6vNrCWLbWCcpog==', '2019-09-20 12:25:19', '2019-09-20 13:00:58'),
(40, NULL, 'RB', 'rb@wts.com', '7377889c1aae549db1ac5dea3e2f90078a69a7385165b79a66ea19ea25eb5f18', '350a/Guz4KZScERafgT9/A==', '2019-09-20 12:26:36', '2019-09-20 13:01:03'),
(43, NULL, 'KK', 'kk@wts.com', 'fa470325018d3e79dac3169c6a4f03ddaa774602172dbc115eab050ae93ffa50', 'GBlTUqg+1coHsHj9hJYYfw==', '2019-09-20 12:34:32', '2019-09-20 12:55:28'),
(44, NULL, 'RB', 'rb@wts.com', 'e003b11c0f6d58258cac7e9f6a2c4732e2ae3394667bc60cb6518a7e1eeb1010', 'GhujXT8QH6hz0RmqPURO5Q==', '2019-09-20 12:35:03', '2019-09-20 12:56:09'),
(45, NULL, 'RV', 'rv@wts.com', 'd117a74de7fa1cc6452b5327bb577b2cd0a87140e530099b059f27ca991c043b', '6Trij2hWtuJe/w2MZi35/w==', '2019-09-20 12:35:47', '2019-09-20 12:35:54'),
(46, NULL, 'DS', 'ds@wts.com', '2b27952efe0e0d8853256657f2e11a751e754970fecf530d75d365bfaffd2287', 'LV9E1F79VamakRtBJjzg4w==', '2019-09-20 12:37:01', '2019-09-20 12:56:18'),
(47, NULL, 'JM', 'jm@wts.com', 'd236f3a9b0cdbab105c6ba52902a9b53e847a7b691f7862d3787ffea3f7d7a2e', '69D/GGv15vBxUKFlLJ9kYA==', '2019-09-20 12:37:59', '2019-09-20 12:37:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `catalogue`
--
ALTER TABLE `catalogue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catalogue`
--
ALTER TABLE `catalogue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
