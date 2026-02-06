-- MySQL dump 10.13  Distrib 8.4.8, for Win64 (x86_64)
--
-- Host: localhost    Database: athar_db
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_order_index` (`order_index`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'شارك أفكارك مع العالم','https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80','bulb','/explore',1,1,'2026-02-02 17:49:49','2026-02-03 15:34:10'),(2,'تواصل مع المبدعين','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80','people','/users',1,2,'2026-02-02 17:49:49','2026-02-02 17:49:49'),(3,'اكتشف مواضيع جديدة','https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80','compass','/boxes',1,3,'2026-02-02 17:49:49','2026-02-02 17:49:49'),(4,'تيست عادي ','/uploads/images/1770054736214-247114013.png','bulb','/explore',1,4,'2026-02-02 17:52:16','2026-02-03 12:52:44');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boxes`
--

DROP TABLE IF EXISTS `boxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boxes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `short_description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `long_description` text COLLATE utf8mb4_unicode_ci,
  `allowed_types` json DEFAULT NULL,
  `rules` json DEFAULT NULL,
  `content_suggestions` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_order_index` (`order_index`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boxes`
--

LOCK TABLES `boxes` WRITE;
/*!40000 ALTER TABLE `boxes` DISABLE KEYS */;
INSERT INTO `boxes` VALUES (1,'صندوق التقنية والبرمجة','أحدث الأفكار والمشاريع في عالم التقنية والبرمجة والذكاء الاصطناعي','مساحة للمطورين والمبرمجين','صندوق التقنية والبرمجة هو مجتمع نابض بالحياة يجمع المطورين والمبرمجين والمهتمين بالتكنولوجيا من جميع أنحاء العالم...','[\"image\", \"video\", \"text\", \"link\"]','[\"شارك كود نظيف ومنظم\", \"اذكر المصادر عند الاقتباس\", \"كن محترماً مع المبتدئين\"]','شارك مشاريعك البرمجية، اكتب عن تجربتك في تعلم لغة جديدة...','code-slash','https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80','#3B82F6',1,1,'2026-02-03 12:43:49','2026-02-03 12:43:49'),(2,'صندوق الفن والإبداع','مساحة للفنانين والمبدعين لمشاركة أعمالهم وإلهام الآخرين','عالم من الإبداع والجمال','صندوق الفن والإبداع هو معرض رقمي يحتفي بجميع أشكال الفن والإبداع...','[\"image\", \"video\", \"text\", \"link\"]','[\"شارك أعمالك الأصلية فقط\", \"احترم حقوق الملكية الفكرية\", \"قدم نقداً بناءً ومحترماً\"]','انشر لوحاتك وتصاميمك، شارك فيديوهات لعمليتك الإبداعية...','color-palette','https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=800&q=80','#8B5CF6',1,2,'2026-02-03 12:43:49','2026-02-03 12:43:49'),(3,'صندوق الكتابة والأدب','قصص وأفكار أدبية من كتّاب موهوبين حول العالم','حيث تنبض الكلمات بالحياة','صندوق الكتابة والأدب هو ملاذ للكتّاب والقراء المتحمسين...','[\"text\", \"image\", \"link\"]','[\"احترم حقوق النشر والملكية الفكرية\", \"قدم نقداً أدبياً بناءً\"]','انشر قصصك وقصائدك، شارك مقتطفات من رواياتك...','book','https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80','#10B981',1,3,'2026-02-03 12:43:49','2026-02-03 12:43:49'),(4,'صندوق الرياضة واللياقة','نصائح وتجارب رياضية لحياة صحية ونشطة','طريقك نحو حياة صحية','صندوق الرياضة واللياقة هو مجتمع داعم للرياضيين وعشاق اللياقة البدنية...','[\"image\", \"video\", \"text\", \"link\"]','[\"شارك نصائح آمنة ومدروسة\", \"احترم مستويات اللياقة المختلفة\"]','شارك روتينك الرياضي، انشر صور تقدمك...','fitness','https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80','#EF4444',1,4,'2026-02-03 12:43:49','2026-02-03 12:43:49'),(5,'صندوق السفر والمغامرات','تجارب سفر مذهلة ووجهات سياحية من حول العالم','استكشف العالم معنا','صندوق السفر والمغامرات هو بوابتك لاستكشاف العالم من خلال عيون المسافرين الآخرين...','[\"image\", \"video\", \"text\", \"link\"]','[\"شارك تجاربك الحقيقية\", \"احترم الثقافات المختلفة\"]','انشر صور رحلاتك، شارك دليل سفر لمدينة زرتها...','airplane','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80','#F59E0B',1,5,'2026-02-03 12:43:49','2026-02-03 12:43:49'),(6,'صندوق ريادة الأعمال','أفكار ونصائح لرواد الأعمال والمشاريع الناشئة','ابدأ مشروعك الخاص','صندوق ريادة الأعمال هو مجتمع لرواد الأعمال الطموحين وأصحاب المشاريع الناشئة...','[\"text\", \"image\", \"video\", \"link\"]','[\"شارك تجارب حقيقية وصادقة\", \"تجنب الترويج المباشر للمنتجات\"]','شارك قصة نجاحك أو فشلك، اكتب عن استراتيجيات التسويق...','briefcase','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80','#06B6D4',1,6,'2026-02-03 12:43:49','2026-02-03 12:43:49');
/*!40000 ALTER TABLE `boxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `box_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_box_id` (`box_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_order_index` (`order_index`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'برمجة','مواضيع البرمجة والتطوير','code','#3B82F6',1,1,1,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(2,'ذكاء اصطناعي','الذكاء الاصطناعي والتعلم الآلي','bulb','#8B5CF6',1,1,2,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(3,'تصميم','التصميم الجرافيكي وتجربة المستخدم','brush','#EC4899',1,1,3,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(4,'رسم','الرسم والفنون التشكيلية','color-palette','#8B5CF6',2,1,1,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(5,'موسيقى','الموسيقى والفنون الصوتية','musical-notes','#F59E0B',2,1,2,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(6,'تصوير','التصوير الفوتوغرافي','camera','#06B6D4',2,1,3,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(7,'شعر','الشعر والقصائد','book','#10B981',3,1,1,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(8,'قصص','القصص القصيرة والروايات','library','#3B82F6',3,1,2,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(9,'مقالات','المقالات والكتابة الحرة','document-text','#F59E0B',3,1,3,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(10,'كرة قدم','كرة القدم والرياضات الجماعية','football','#EF4444',4,1,1,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(11,'لياقة','اللياقة البدنية والتمارين','fitness','#10B981',4,1,2,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(12,'تغذية','التغذية الصحية','nutrition','#F59E0B',4,1,3,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(13,'سياحة','السياحة والسفر','airplane','#06B6D4',5,1,1,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(14,'مغامرات','المغامرات والرحلات','compass','#EF4444',5,1,2,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(15,'ثقافات','الثقافات والتقاليد','globe','#8B5CF6',5,1,3,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(16,'ريادة','ريادة الأعمال والشركات الناشئة','rocket','#06B6D4',6,1,1,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(17,'تسويق','التسويق والمبيعات','megaphone','#EC4899',6,1,2,'2026-02-01 14:35:22','2026-02-01 14:35:22'),(18,'إدارة','الإدارة والقيادة','briefcase','#3B82F6',6,1,3,'2026-02-01 14:35:22','2026-02-01 14:35:22');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,2,'مقال رائع! أنا أيضاً أتعلم React Native حالياً',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(2,1,3,'شكراً على المشاركة، نصائح مفيدة جداً',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(3,2,1,'اللوحة جميلة جداً! أحب الألوان',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(4,2,4,'إبداع حقيقي، استمري',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(5,3,5,'قصة مؤثرة، متى سنقرأ المزيد؟',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(6,4,6,'هل يمكنك مشاركة تفاصيل الروتين؟',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(7,5,7,'اليابان على قائمتي! أي نصائح؟',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(8,6,8,'دروس قيمة، شكراً على الصراحة',NULL,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(9,18,11,'12312312312312321312312312312',NULL,'2026-02-01 19:45:08','2026-02-01 19:45:08'),(10,18,2,'1231q233',NULL,'2026-02-02 14:06:22','2026-02-02 14:06:22'),(11,13,11,'Good job\nBlowjob',NULL,'2026-02-02 14:26:28','2026-02-02 14:26:28'),(12,16,2,'Reredddd',NULL,'2026-02-02 16:36:12','2026-02-02 16:36:12'),(13,20,11,'dddddd',NULL,'2026-02-03 17:25:29','2026-02-03 17:25:29'),(14,13,11,'Rdswadsd',NULL,'2026-02-03 18:37:07','2026-02-03 18:37:07'),(15,13,11,'Rdswadsd',NULL,'2026-02-03 18:39:46','2026-02-03 18:39:46'),(16,13,11,'123123123123123123123123',NULL,'2026-02-03 18:39:51','2026-02-03 18:39:51');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','read','replied','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_reply` text COLLATE utf8mb4_unicode_ci,
  `replied_by` int DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `replied_by` (`replied_by`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `contact_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `contact_messages_ibfk_2` FOREIGN KEY (`replied_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,11,'ddd',NULL,'07712345677','1231231231231231231212','12321312312312','closed','12312312312312312بقلابلابلابلابلايبلابيلالتبلاالبتلتابلاتبلاتلتابلات',9,'2026-02-03 18:59:02','2026-02-03 18:58:19','2026-02-03 19:00:33');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorite` (`post_id`,`user_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (2,16,2,'2026-02-02 16:36:10'),(5,20,11,'2026-02-03 18:49:19'),(6,19,11,'2026-02-03 18:49:32');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `follower_id` int NOT NULL,
  `followed_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_follow` (`follower_id`,`followed_id`),
  KEY `idx_follower_id` (`follower_id`),
  KEY `idx_followed_id` (`followed_id`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (1,1,2,'2026-02-01 14:35:39'),(2,1,3,'2026-02-01 14:35:39'),(3,2,1,'2026-02-01 14:35:39'),(4,2,4,'2026-02-01 14:35:39'),(5,3,1,'2026-02-01 14:35:39'),(6,3,5,'2026-02-01 14:35:39'),(7,4,2,'2026-02-01 14:35:39'),(8,5,3,'2026-02-01 14:35:39'),(9,6,1,'2026-02-01 14:35:39'),(10,7,2,'2026-02-01 14:35:39'),(12,2,11,'2026-02-02 16:35:55'),(13,11,2,'2026-02-03 19:48:11'),(14,11,5,'2026-02-03 19:55:44');
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`post_id`,`user_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,1,2,'2026-02-01 14:35:39'),(2,1,3,'2026-02-01 14:35:39'),(3,1,4,'2026-02-01 14:35:39'),(4,2,1,'2026-02-01 14:35:39'),(5,2,3,'2026-02-01 14:35:39'),(6,2,5,'2026-02-01 14:35:39'),(7,3,2,'2026-02-01 14:35:39'),(8,3,6,'2026-02-01 14:35:39'),(9,4,1,'2026-02-01 14:35:39'),(10,4,3,'2026-02-01 14:35:39'),(11,4,5,'2026-02-01 14:35:39'),(12,4,7,'2026-02-01 14:35:39'),(13,5,2,'2026-02-01 14:35:39'),(14,5,4,'2026-02-01 14:35:39'),(15,5,6,'2026-02-01 14:35:39'),(17,15,11,'2026-02-01 18:07:49'),(20,18,2,'2026-02-02 14:06:06'),(21,16,11,'2026-02-02 14:08:51'),(22,18,11,'2026-02-02 14:08:56'),(24,16,2,'2026-02-02 16:36:04'),(26,20,11,'2026-02-03 18:44:03');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('like','comment','follow','mention','admin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text COLLATE utf8mb4_unicode_ci,
  `related_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,'like','إعجاب جديد','أعجب مستخدم بمنشورك','{\"type\": \"like\", \"post_id\": \"13\"}',1,'2026-02-02 14:26:13','أعجب مستخدم بمنشورك',13,11),(2,2,'comment','تعليق جديد','علق أحد المستخدمين على منشورك','{\"type\": \"comment\", \"post_id\": \"13\"}',1,'2026-02-02 14:26:28','علق أحد المستخدمين على منشورك',13,11),(3,11,'follow','متابعة جديدة','بدأ مستخدم بمتابعتك',NULL,1,'2026-02-02 16:35:55','بدأ مستخدم بمتابعتك',2,2),(4,11,'like','إعجاب جديد','أعجب مستخدم بمنشورك','{\"type\": \"like\", \"post_id\": \"16\"}',1,'2026-02-02 16:36:04','أعجب مستخدم بمنشورك',16,2),(5,11,'comment','تعليق جديد','علق أحد المستخدمين على منشورك','{\"type\": \"comment\", \"post_id\": \"16\"}',1,'2026-02-02 16:36:12','علق أحد المستخدمين على منشورك',16,2),(6,11,'admin','ترحيب بالمستخدمين الجدد','مرحباً بك في أثر! نتمنى لك تجربة رائعة في مشاركة أفكارك واكتشاف محتوى جديد.','{}',1,'2026-02-02 16:47:07',NULL,NULL,NULL),(7,2,'comment',NULL,'Rdswadsd',NULL,0,'2026-02-03 18:39:46','علق على منشورك',13,11),(8,2,'comment',NULL,'123123123123123123123123',NULL,0,'2026-02-03 18:39:51','علق على منشورك',13,11),(9,2,'like',NULL,'أعجب بمنشورك',NULL,0,'2026-02-03 18:42:03','أعجب بمنشورك',13,11),(10,2,'like',NULL,'أعجب بمنشورك',NULL,0,'2026-02-03 18:44:03','أعجب بمنشورك',20,11),(11,5,'follow',NULL,'بدأ بمتابعتك',NULL,0,'2026-02-03 19:55:44','بدأ بمتابعتك',11,11);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('text','image','video','link') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_archived` tinyint(1) DEFAULT '0',
  `is_private` tinyint(1) DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `views_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_category` (`category`),
  KEY `idx_is_private` (`is_private`),
  KEY `idx_is_featured` (`is_featured`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `idx_content` (`title`,`content`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'text','تجربتي في تعلم React Native','بدأت رحلتي في تعلم React Native منذ شهرين، وأود مشاركة تجربتي معكم. التحديات كانت كثيرة في البداية، لكن المجتمع الداعم والموارد المتاحة ساعدتني كثيراً. أنصح المبتدئين بالتركيز على الأساسيات أولاً قبل الانتقال للمكتبات المتقدمة.',NULL,NULL,'تقنية',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(2,2,'text','لوحتي الجديدة - غروب الشمس','لوحة جديدة رسمتها بالألوان المائية، مستوحاة من غروب الشمس على شاطئ البحر. استغرقت مني 3 أيام لإكمالها.',NULL,NULL,'فن',0,0,0,1,'2026-02-01 14:35:39','2026-02-02 14:18:10'),(3,3,'text','قصة قصيرة: الطريق','كان الطريق طويلاً، والليل حالكاً. سار وحيداً، لا يرافقه سوى صوت خطواته على الحصى. في نهاية الطريق، كان هناك نور خافت يلوح في الأفق، كأنه يدعوه للمضي قدماً...',NULL,NULL,'أدب',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(4,4,'text','روتيني الصباحي للياقة','أشارك معكم روتيني الصباحي الذي ساعدني على خسارة 15 كيلو في 3 أشهر. التمارين بسيطة ولا تحتاج معدات!',NULL,NULL,'رياضة',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(5,5,'text','رحلتي إلى اليابان','زيارة طوكيو كانت حلماً تحقق! المدينة مذهلة بتناقضاتها بين التقليد والحداثة. تجربة لا تُنسى.',NULL,NULL,'سفر',0,0,0,1,'2026-02-01 14:35:39','2026-02-02 14:17:39'),(6,6,'text','5 دروس تعلمتها من فشل مشروعي الأول','فشل مشروعي الأول كان أفضل معلم لي. تعلمت أهمية دراسة السوق، الاستماع للعملاء، وعدم الاستسلام. اليوم، مشروعي الثاني ينمو بشكل مستمر بفضل هذه الدروس.',NULL,NULL,'أعمال',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(7,7,'text','أفضل 10 مصادر لتعلم البرمجة مجاناً','جمعت لكم أفضل المصادر المجانية لتعلم البرمجة من الصفر. هذه المواقع ساعدتني شخصياً في بداية مسيرتي.',NULL,NULL,'تقنية',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(8,8,'text','تصميم شعار جديد لمقهى محلي','سعيد بمشاركة آخر أعمالي - تصميم هوية بصرية كاملة لمقهى محلي. التحدي كان في دمج الطابع التقليدي مع لمسة عصرية.',NULL,NULL,'فن',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(9,1,'text','نصائح لتحسين أداء تطبيقات React','بعد سنوات من العمل مع React، جمعت أهم النصائح لتحسين الأداء: استخدام React.memo، تجنب Re-renders غير الضرورية، واستخدام lazy loading للمكونات الكبيرة.',NULL,NULL,'تقنية',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(10,2,'text','تقنيات الرسم بالألوان الزيتية','الألوان الزيتية تتطلب صبراً وممارسة. أهم نصيحة: ابدأ بطبقات رقيقة واترك كل طبقة تجف قبل إضافة التالية.',NULL,NULL,'فن',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(11,4,'text','أهمية تمارين الإحماء','تمارين الإحماء ليست اختيارية! 10 دقائق من الإحماء يمكن أن تمنع إصابات خطيرة وتحسن أداءك الرياضي بشكل كبير.',NULL,NULL,'رياضة',0,0,0,0,'2026-02-01 14:35:39','2026-02-01 14:35:39'),(12,5,'text','نصائح للسفر بميزانية محدودة','السفر لا يجب أن يكون مكلفاً! احجز مبكراً، استخدم تطبيقات المقارنة، وفكر في الإقامة في نُزل بدلاً من الفنادق.',NULL,NULL,'سفر',0,0,0,1,'2026-02-01 14:35:39','2026-02-02 15:56:06'),(13,2,'text','hghgr','hghghg',NULL,NULL,'تقنية',0,0,0,10,'2026-02-01 17:17:36','2026-02-03 18:44:26'),(14,11,'text','123','123',NULL,NULL,'رسم',0,0,0,0,'2026-02-01 17:42:10','2026-02-01 17:42:10'),(15,11,'text','123','123',NULL,NULL,'موسيقى',0,0,0,2,'2026-02-01 17:44:02','2026-02-03 12:24:57'),(16,11,'text','123333','3333333',NULL,NULL,'تصوير',0,0,0,8,'2026-02-01 17:57:49','2026-02-03 19:43:49'),(17,11,'text','jk,kjljk','kjlkjljkljklk',NULL,NULL,'رسم',0,1,0,0,'2026-02-01 19:00:00','2026-02-01 19:00:00'),(18,11,'link','asdfdsfsdff','dsfsdfsdf',NULL,'https://dasdsad.com','ذكاء اصطناعي',0,0,0,15,'2026-02-01 19:34:20','2026-02-03 18:46:47'),(19,2,'text','Eeeeew','Wwwsss',NULL,NULL,'كرة قدم',0,0,0,1,'2026-02-02 16:34:23','2026-02-03 18:49:31'),(20,2,'text','Ffff','Dddd',NULL,NULL,'تصميم',0,0,0,5,'2026-02-02 16:35:10','2026-02-03 18:49:21'),(21,11,'text','123123123','1323123123123123123123123123',NULL,NULL,'رسم',0,1,0,0,'2026-02-03 15:48:20','2026-02-03 15:48:20');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reporter_id` int NOT NULL,
  `type` enum('post','user','comment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','resolved','dismissed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reporter_id` (`reporter_id`),
  KEY `idx_type` (`type`),
  KEY `idx_target_id` (`target_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,11,'post',20,'سبام (إزعاج)','hghghghghg','pending',NULL,'2026-02-03 12:43:59','2026-02-03 12:43:59'),(2,11,'user',2,'محتوى غير لائق','12312312','pending',NULL,'2026-02-03 12:45:03','2026-02-03 12:45:03'),(3,11,'comment',12,'آخر','12312312321321dfdggdfgfd','pending',NULL,'2026-02-03 12:45:29','2026-02-03 12:45:29');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `profile_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `push_token` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `is_banned` tinyint(1) DEFAULT '0',
  `ban_reason` text COLLATE utf8mb4_unicode_ci,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'07701234567','أحمد محمد','ahmed@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','مطور تطبيقات | مهتم بالتقنية والبرمجة',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(2,'07712345678','سارة الفنانة','sara@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','فنانة تشكيلية | أحب الألوان المائية',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(3,'07723456789','أحمد الكاتب','ahmed.writer@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','كاتب وروائي | أحب القصص القصيرة',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(4,'07734567890','محمد الرياضي','mohamed@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','مدرب لياقة بدنية | نمط حياة صحي',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(5,'07745678901','ليلى المسافرة','layla@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','عاشقة السفر والمغامرات | 45 دولة',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(6,'07756789012','خالد رائد الأعمال','khaled@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','رائد أعمال | مؤسس 3 شركات ناشئة',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(7,'07767890123','فاطمة المطورة','fatima@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','مطورة Full Stack | React & Node.js',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(8,'07778901234','عمر المصمم','omar@example.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','مصمم جرافيك | UI/UX Designer',NULL,NULL,1,0,NULL,'user','2026-02-01 14:35:39','2026-02-01 14:35:39'),(9,'07789012345','مدير النظام','admin@athar.com','$2a$10$XM9fNKWTDAIoUI3pBbN6gecTBU9ntMoUt/SNicRQQ1cyoH1tsaCha','مدير منصة أثر',NULL,NULL,1,0,NULL,'admin','2026-02-01 14:35:39','2026-02-01 14:35:39'),(10,'07761763665','مستخدم تجريبي','test@athar.app','$2a$10$Y6Q8SAXDO2.g2sBntU0squKiC2vWQcG8nIw2vUYHg1m5iMUQaoHYO','حساب تجريبي للتطوير',NULL,NULL,1,0,NULL,'user','2026-02-01 15:13:36','2026-02-01 15:13:36'),(11,'07712345677','11111ddd',NULL,NULL,'Iam123123 programmer ','/uploads/images/profile_image-1770146970901-564352243.jpeg',NULL,1,0,NULL,'user','2026-02-01 17:41:46','2026-02-03 19:29:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-05 18:55:52
