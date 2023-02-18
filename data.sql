-- MySQL dump 10.16  Distrib 10.1.48-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: db
-- ------------------------------------------------------
-- Server version	10.1.48-MariaDB-0+deb9u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `config_entity`
--

DROP TABLE IF EXISTS `config_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config_entity` (
  `id` tinyint(4) DEFAULT NULL,
  `name` varchar(13) DEFAULT NULL,
  `guild_id` bigint(20) DEFAULT NULL,
  `value` varchar(19) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_entity`
--

LOCK TABLES `config_entity` WRITE;
/*!40000 ALTER TABLE `config_entity` DISABLE KEYS */;
INSERT INTO `config_entity` VALUES (1,'forum-channel',868013470023548938,'1071706703655092355'),(2,'bot-channel',868013470023548938,'1073246105023811718');
/*!40000 ALTER TABLE `config_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pull_request_entity`
--

DROP TABLE IF EXISTS `pull_request_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pull_request_entity` (
  `id` tinyint(4) DEFAULT NULL,
  `name` varchar(67) DEFAULT NULL,
  `repo_name` varchar(10) DEFAULT NULL,
  `github_number` mediumint(9) DEFAULT NULL,
  `forum_thread_id` varchar(19) DEFAULT NULL,
  `first_post_id` varchar(19) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pull_request_entity`
--

LOCK TABLES `pull_request_entity` WRITE;
/*!40000 ALTER TABLE `pull_request_entity` DISABLE KEYS */;
INSERT INTO `pull_request_entity` VALUES (1,'Improve GPS Rescue Pitch smoothing and disarming','betaflight',12343,'1075339255733297182','1075339255733297182',-1),(2,'Add rainbow effect to led strip','betaflight',12323,'1075339258233094214','1075339258233094214',-1),(3,'Fix motors incorrect spin direction after fast arm from turtle mode','betaflight',12276,'1075339259537526804','1075339259537526804',-1),(4,'Move gyro filters to PID profile','betaflight',12224,'1075339260858744832','1075339260858744832',-1),(5,'Throttlebased EzLanding','betaflight',12094,'1075339262213492777','1075339262213492777',-1),(6,'Angle mode feedforward and earth referencing of yaw inputs','betaflight',12067,'1075339263710867466','1075339263710867466',-1),(7,'RPM Limiter','betaflight',12054,'1075339265308885052','1075339265308885052',-1),(8,'ezLanding','betaflight',11998,'1075339267485728791','1075339267485728791',-1),(9,'Add GPS Lap Timer','betaflight',11856,'1075339269641621534','1075339269641621534',-1);
/*!40000 ALTER TABLE `pull_request_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reaction_counter_entity`
--

DROP TABLE IF EXISTS `reaction_counter_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reaction_counter_entity` (
  `id` varchar(0) DEFAULT NULL,
  `user_id` varchar(0) DEFAULT NULL,
  `counter` varchar(0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reaction_counter_entity`
--

LOCK TABLES `reaction_counter_entity` WRITE;
/*!40000 ALTER TABLE `reaction_counter_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `reaction_counter_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repository_entity`
--

DROP TABLE IF EXISTS `repository_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `repository_entity` (
  `id` tinyint(4) DEFAULT NULL,
  `name` varchar(23) DEFAULT NULL,
  `github_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repository_entity`
--

LOCK TABLES `repository_entity` WRITE;
/*!40000 ALTER TABLE `repository_entity` DISABLE KEYS */;
INSERT INTO `repository_entity` VALUES (1,'betaflight',37060852),(2,'betaflight',37060852),(3,'betaflight',37060852),(4,'betaflight',37060852),(5,'betaflight.com',99039116),(6,'betaflight.com',99039116),(7,'betaflight.com',99039116),(8,'betaflight.com',99039116),(9,'betaflight-configurator',60735171),(10,'betaflight-configurator',60735171),(11,'betaflight-configurator',60735171),(12,'betaflight-configurator',60735171);
/*!40000 ALTER TABLE `repository_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sqlite_sequence`
--

DROP TABLE IF EXISTS `sqlite_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sqlite_sequence` (
  `name` varchar(19) DEFAULT NULL,
  `seq` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sqlite_sequence`
--

LOCK TABLES `sqlite_sequence` WRITE;
/*!40000 ALTER TABLE `sqlite_sequence` DISABLE KEYS */;
INSERT INTO `sqlite_sequence` VALUES ('repository_entity',12),('config_entity',2),('pull_request_entity',9);
/*!40000 ALTER TABLE `sqlite_sequence` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-27 22:44:46
