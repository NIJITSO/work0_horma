-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: alhurra_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Argan','argan','Produits de la gamme Argan','/images/categories/argan.png',1,'2026-09-23 12:24:06.269','2026-09-24 00:19:29.266'),(2,'Nila','nila','Produits de la gamme Nila','/images/categories/nila.png',1,'2026-09-23 12:24:06.310','2026-09-24 00:19:29.268'),(3,'Figue de Barbarie','figue-de-barbarie','Produits de la gamme Figue de Barbarie','/images/categories/figue-de-barbarie.png',1,'2026-09-23 12:24:06.327','2026-09-24 00:19:29.271'),(4,'Savons','savons','Produits de la gamme Savons','/images/categories/savons.png',1,'2026-09-23 12:24:06.363','2026-09-24 00:19:29.273'),(5,'Sérums','serums','Produits de la gamme Sérums','/images/categories/serums.png',1,'2026-09-23 12:24:06.396','2026-09-24 00:19:29.275'),(6,'Gommages','gommages','Produits de la gamme Gommages','/images/categories/gommages.png',1,'2026-09-23 12:24:06.429','2026-09-24 00:19:29.278');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(191) NOT NULL,
  `last_name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'فاطمة الزهراء','العلوي','fatima@alhurra.ma','0661234567',NULL,'Quartier Palmier, Rue 12, N 4','الدار البيضاء',1,'2026-09-23 12:24:07.359','2026-09-23 12:24:07.359'),(2,'Nora','Bennani',NULL,'0655443322',NULL,'Gueliz Rue de la Liberte','Marrakech',1,'2026-09-23 12:25:30.429','2026-09-23 12:25:30.429'),(3,'Amine','Test',NULL,'0612345678',NULL,'Boulevard d Anfa','Casablanca',1,'2026-09-23 16:35:34.573','2026-09-23 16:35:34.573');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_fkey` (`order_id`),
  KEY `order_items_product_variant_id_fkey` (`product_variant_id`),
  CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_product_variant_id_fkey` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `order_number` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'en_attente',
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_key` (`order_number`),
  KEY `orders_customer_id_fkey` (`customer_id`),
  CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image` varchar(191) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_fkey` (`product_id`),
  CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (71,1,'/images/products/savon-noir.jpeg',1,'2026-09-24 00:19:29.284'),(72,2,'/images/products/serum-argan-hibiscus.jpeg',1,'2026-09-24 00:19:29.297'),(73,4,'/images/products/creme-hydratante-argan.jpeg',1,'2026-09-24 00:19:29.308'),(74,11,'/images/products/gommage-corps.jpeg',1,'2026-09-24 00:19:29.318'),(75,7,'/images/products/serum-argan.jpeg',1,'2026-09-24 00:19:29.327'),(76,8,'/images/products/gel-douche-argan-miel.jpeg',1,'2026-09-24 00:19:29.334'),(77,10,'/images/products/eau-rose.jpeg',1,'2026-09-24 00:19:29.349'),(78,12,'/images/products/baume-levres.jpeg',1,'2026-09-24 00:19:29.365');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `scent_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `sku` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_variants_sku_key` (`sku`),
  KEY `product_variants_product_id_fkey` (`product_id`),
  KEY `product_variants_scent_id_fkey` (`scent_id`),
  KEY `product_variants_size_id_fkey` (`size_id`),
  CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_variants_scent_id_fkey` FOREIGN KEY (`scent_id`) REFERENCES `scents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `product_variants_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (209,1,1,7,'AH-SAVON_NATUREL-100G',139.00,45,'/images/productsVariants/1-naturel.jpeg',1,'2026-09-24 00:19:29.286','2026-09-24 00:19:29.286'),(210,1,4,7,'AH-SAVON_EUCALYPTUS-100G',139.00,50,'/images/productsVariants/1-eucalyptus.png',1,'2026-09-24 00:19:29.288','2026-09-24 00:19:29.288'),(211,1,2,7,'AH-SAVON_ORANGER-100G',139.00,55,'/images/productsVariants/1-fleur-oranger.png',1,'2026-09-24 00:19:29.290','2026-09-24 00:19:29.290'),(212,2,13,1,'AH-SERUM_ARGAN_HIBISCUS-50ML',219.00,45,'/images/productsVariants/2-hibiscus.jpeg',1,'2026-09-24 00:19:29.299','2026-09-24 00:19:29.299'),(213,2,14,1,'AH-SERUM_ARGAN_ANTIFOURCHES-50ML',219.00,50,'/images/productsVariants/2-anti-fourches.png',1,'2026-09-24 00:19:29.302','2026-09-24 00:19:29.302'),(214,4,1,6,'AH-CREME_HYDRATANTE_ARGAN',239.00,45,'/images/products/creme-hydratante-argan.jpeg',1,'2026-09-24 00:19:29.311','2026-09-24 00:19:29.311'),(215,11,11,10,'AH-GOMMAGE_CORPS-NILA-200G',229.00,45,'/images/productsVariants/5-nila.jpeg',1,'2026-09-24 00:19:29.320','2026-09-24 00:19:29.320'),(216,11,12,10,'AH-GOMMAGE_CORPS-AKAR_FASSI-200G',199.00,50,'/images/productsVariants/5-akar-fassi.jpeg',1,'2026-09-24 00:19:29.322','2026-09-24 00:19:29.322'),(217,7,1,9,'AH-SERUM_ARGAN',249.00,45,'/images/products/serum-argan.jpeg',1,'2026-09-24 00:19:29.329','2026-09-24 00:19:29.329'),(218,8,7,2,'AH-GEL_DOUCHE-MIEL-100ML',85.00,45,'/images/productsVariants/8-miel.jpeg',1,'2026-09-24 00:19:29.335','2026-09-24 00:19:29.335'),(219,8,8,2,'AH-GEL_DOUCHE-ARGAN-100ML',85.00,50,'/images/productsVariants/8-argan.png',1,'2026-09-24 00:19:29.337','2026-09-24 00:19:29.337'),(220,8,9,2,'AH-GEL_DOUCHE-JASMINE-100ML',89.00,55,'/images/productsVariants/8-jasmine.png',1,'2026-09-24 00:19:29.339','2026-09-24 00:19:29.339'),(221,8,10,2,'AH-GEL_DOUCHE-GARDENIA-100ML',89.00,60,'/images/productsVariants/8-gardenia.png',1,'2026-09-24 00:19:29.341','2026-09-24 00:19:29.341'),(222,8,2,2,'AH-GEL_DOUCHE-ORANGER-100ML',89.00,65,'/images/productsVariants/8-fleur-oranger.png',1,'2026-09-24 00:19:29.343','2026-09-24 00:19:29.343'),(223,8,4,2,'AH-GEL_DOUCHE-EUCALYPTUS-100ML',89.00,70,'/images/productsVariants/8-eucalyptus.png',1,'2026-09-24 00:19:29.344','2026-09-24 00:19:29.344'),(224,10,3,2,'AH-LAIT_CORPOREL-ROSE-100ML',169.00,45,'/images/productsVariants/10-rose.jpeg',1,'2026-09-24 00:19:29.351','2026-09-24 00:19:29.351'),(225,10,1,2,'AH-LAIT_CORPOREL-NATUREL-100ML',169.00,50,'/images/productsVariants/10-naturel.png',1,'2026-09-24 00:19:29.353','2026-09-24 00:19:29.353'),(226,10,10,2,'AH-LAIT_CORPOREL-GARDENIA-100ML',169.00,55,'/images/productsVariants/10-gardenia.png',1,'2026-09-24 00:19:29.354','2026-09-24 00:19:29.354'),(227,10,7,2,'AH-LAIT_CORPOREL-MIEL-100ML',169.00,60,'/images/productsVariants/10-miel.png',1,'2026-09-24 00:19:29.356','2026-09-24 00:19:29.356'),(228,10,2,2,'AH-LAIT_CORPOREL-ORANGER-100ML',169.00,65,'/images/productsVariants/10-fleur-oranger.png',1,'2026-09-24 00:19:29.358','2026-09-24 00:19:29.358'),(229,12,8,12,'AH-BAUME_LEVRES-ARGAN-20G',89.00,45,'/images/products/baume-levres.jpeg',1,'2026-09-24 00:19:29.367','2026-09-24 00:19:29.367');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `main_image` varchar(191) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `nameAr` varchar(191) DEFAULT NULL,
  `nameFr` varchar(191) DEFAULT NULL,
  `subtitleAr` varchar(191) DEFAULT NULL,
  `subtitleFr` varchar(191) DEFAULT NULL,
  `descriptionAr` text DEFAULT NULL,
  `descriptionFr` text DEFAULT NULL,
  `ingredientsAr` text DEFAULT NULL,
  `ingredientsFr` text DEFAULT NULL,
  `usageAr` text DEFAULT NULL,
  `usageFr` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  KEY `products_category_id_fkey` (`category_id`),
  CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,4,'Savon naturel artisanal','savon-noir','Ce savon naturel nettoie délicatement la peau tout en respectant son équilibre. Sa texture artisanale convient à une utilisation régulière pour laisser la peau propre, fraîche et agréablement douce.','/images/products/savon-noir.jpeg',139.00,1,'2026-09-23 12:24:06.457','2026-09-24 00:19:29.280','صابون طبيعي تقليدي','Savon naturel artisanal','عناية تنظيف تقليدية لبشرة نظيفة وناعمة (أصيل / أوكالبتوس / زهر البرتقال).','Un soin nettoyant traditionnel pour une peau propre et douce (Naturel / Eucalyptus / Fleur d’oranger).','ينظف هذا الصابون الطبيعي البشرة بلطف مع احترام توازنها الطبيعي. تركيبته التقليدية مناسبة للاستعمال المنتظم وتترك البشرة نظيفة ومنتعشة وناعمة.','Ce savon naturel nettoie délicatement la peau tout en respectant son équilibre. Sa texture artisanale convient à une utilisation régulière pour laisser la peau propre, fraîche et agréablement douce.','قاعدة صابون طبيعية ومستخلصات نباتية.','Base de savon naturelle et extraits végétaux.','يستخدم على بشرة مبللة ويدلك بلطف بحركات دائرية ثم يشطف بالماء الدافئ.','Appliquer sur peau humide, masser délicatement en mouvements circulaires puis rincer à l’eau tiède.'),(2,5,'Sérum cheveux & barbe à l’argan','serum-argan-hibiscus','Un sérum enrichi en huile d’argan et hibiscus, conçu pour nourrir les cheveux et la barbe. Il aide à améliorer la douceur, la brillance et l’apparence générale des fibres capillaires.','/images/products/serum-argan-hibiscus.jpeg',219.00,1,'2026-09-23 12:24:06.553','2026-09-24 00:19:29.293','سيروم الشعر واللحية بالأركان','Sérum cheveux & barbe à l’argan','عناية مغذية للشعر واللحية (كركديه / ضد التقصف).','Soin capillaire nourrissant pour cheveux et barbe (Hibiscus / Anti-fourches).','سيروم غني بزيت الأركان والكركديه، مصمم لتغذية الشعر واللحية. يساعد على تحسين النعومة واللمعان والمظهر العام لألياف الشعر.','Un sérum enrichi en huile d’argan et hibiscus, conçu pour nourrir les cheveux et la barbe. Il aide à améliorer la douceur, la brillance et l’apparence générale des fibres capillaires.','زيت الأركان، مستخلص الكركديه وزيوت نباتية.','Huile d’argan, extrait d’hibiscus et huiles végétales.','توضع بضع قطرات على راحة اليد وتوزع بالتساوي على أطراف الشعر أو شعر اللحية.','Appliquer quelques gouttes sur la paume des mains et répartir uniformément sur les pointes des cheveux ou la barbe.'),(4,1,'Crème hydratante à l’huile d’argan','creme-hydratante-argan','Une crème hydratante enrichie en huile d’argan qui aide à nourrir la peau et à limiter les sensations de sécheresse. Elle laisse la peau douce, souple et confortable.','/images/products/creme-hydratante-argan.jpeg',239.00,1,'2026-09-23 12:24:06.721','2026-09-24 00:19:29.304','كريم مرطب بزيت الأركان','Crème hydratante à l’huile d’argan','ترطيب يومي لبشرة ناعمة ومريحة.','Hydratation quotidienne pour une peau douce et confortable.','كريم مرطب غني بزيت الأركان يساعد على تغذية البشرة وتقليل الإحساس بالجفاف. يترك البشرة ناعمة ومرنة ومريحة.','Une crème hydratante enrichie en huile d’argan qui aide à nourrir la peau et à limiter les sensations de sécheresse. Elle laisse la peau douce, souple et confortable.','زيت الأركان ومكونات مرطبة.','Huile d’argan et agents hydratants.','يوضع يومياً على الوجه والرقبة لترطيب فوري وحماية تدوم طوال اليوم.','Appliquer quotidiennement sur le visage et le cou pour une hydratation immédiate et durable.'),(7,5,'Sérum visage à l’huile d’argan','serum-argan','Ce sérum associe l’huile d’argan, l’huile de figue de Barbarie, le collagène et l’acide hyaluronique. Il aide à hydrater la peau, améliorer sa souplesse et lui donner une apparence plus lisse.','/images/products/serum-argan.jpeg',249.00,1,'2026-09-23 12:24:07.026','2026-09-24 00:19:29.325','سيروم الوجه بزيت الأركان','Sérum visage à l’huile d’argan','عناية مجددة وممتلئة المظهر للوجه.','Soin régénérant et repulpant pour le visage.','يجمع هذا السيروم بين زيت الأركان وزيت التين الشوكي والكولاجين وحمض الهيالورونيك. يساعد على ترطيب البشرة وتحسين مرونتها ومنحها مظهراً أكثر نعومة وامتلاءً.','Ce sérum associe l’huile d’argan, l’huile de figue de Barbarie, le collagène et l’acide hyaluronique. Il aide à hydrater la peau, améliorer sa souplesse et lui donner une apparence plus lisse.','زيت الأركان، زيت التين الشوكي، الكولاجين وحمض الهيالورونيك.','Huile d’argan, huile de figue de Barbarie, collagène et acide hyaluronique.','توضع 3 إلى 4 قطرات ليلاً على بشرة نظيفة للوجه والعنق مع التدليك بلطف بحركات دائرية.','Appliquer 3 à 4 gouttes le soir sur une peau propre, masser délicatement en mouvements circulaires.'),(8,1,'Gel douche Argan & Miel','gel-douche-argan-miel','Ce gel douche associe l’huile d’argan et le miel pour nettoyer la peau délicatement. Sa formule convient à une utilisation quotidienne et laisse la peau douce et agréable.','/images/products/gel-douche-argan-miel.jpeg',159.00,1,'2026-09-23 12:24:07.101','2026-09-24 00:19:29.331','جل الاستحمام بالأركان والعسل','Gel douche Argan & Miel','تنظيف لطيف لبشرة نظيفة ومريحة.','Nettoyage doux pour une peau propre et confortable.','يجمع جل الاستحمام بين زيت الأركان والعسل لتنظيف البشرة بلطف. تركيبته مناسبة للاستعمال اليومي وتترك البشرة ناعمة ومريحة.','Ce gel douche associe l’huile d’argan et le miel pour nettoyer la peau délicatement. Sa formule convient à une utilisation quotidienne et laisse la peau douce et agréable.','زيت الأركان، العسل وقاعدة تنظيف لطيفة.','Huile d’argan, miel et base lavante douce.','يوضع على ليفة استحمام مبللة، يدلك على الجسم حتى تتشكل رغوة لطيفة، ثم يشطف جيداً.','Faire mousser sur peau mouillée sous la douche, masser sur l’ensemble du corps puis rincer abondamment.'),(10,1,'Lait corporel','eau-rose','Ce lait corporel hydrate et nourrit la peau au quotidien. Sa texture légère pénètre facilement et laisse la peau douce, confortable et délicatement parfumée.','/images/products/eau-rose.jpeg',169.00,1,'2026-09-23 12:24:07.275','2026-09-24 00:19:29.346','حليب الجسم الطبيعي','Lait corporel','عناية مغذية ومرطبة متوفرة بعدة روائح طبيعية فاخرة.','Soin nourrissant et hydratant décliné en plusieurs senteurs délicates.','يرطب حليب الجسم البشرة ويغذيها يومياً. تركيبته الخفيفة سريعة الامتصاص وتترك البشرة ناعمة ومريحة ومعطرة بعبير ناعم يدوم طويلاً.','Ce lait corporel hydrate et nourrit la peau au quotidien. Sa texture légère pénètre facilement et laisse la peau douce, confortable et délicatement parfumée.','مستخلص الورد، زيوت نباتية ومكونات مرطبة.','Extrait de rose, huiles végétales et agents hydratants.','يدهن على كامل الجسم بعد الاستحمام مع تدليك خفيف حتى تمام الامتصاص.','Appliquer sur l’ensemble du corps après la douche en massant légèrement jusqu’à absorption complète.'),(11,6,'Gommage corps traditionnel','gommage-corps','Inspiré des rituels ancestraux du hammam marocain, ce gommage corps naturel exfolie délicatement, affine le grain de peau et révèle un éclat incomparable. Disponible à base de Nila bleue authentique ou d’Akar Fassi précieux.','/images/products/gommage-corps.jpeg',199.00,1,'2026-09-23 17:00:14.199','2026-09-24 00:19:29.314','مقشر الجسم الطبيعي','Gommage corps traditionnel','تقشير مغربي تقليدي لبشرة ناعمة ومشرقة (نيلة زرقاء / عكر فاسي).','Exfoliation traditionnelle pour une peau douce et lumineuse (Nila / Akar Fassi).','مستوحى من طقوس الحمام والجمال المغربي الأصيل، يساعد مقشر الجسم الطبيعي على إزالة الخلايا الميتة بلطف وتغذية البشرة وإبراز إشراقتها الطبيعية. متوفر بخلاصة النيلة الزرقاء الصحراوية أو العكر الفاسي الأصيل.','Inspiré des rituels ancestraux du hammam marocain, ce gommage corps naturel exfolie délicatement, affine le grain de peau et révèle un éclat incomparable. Disponible à base de Nila bleue authentique ou d’Akar Fassi précieux.','حبيبات مقشرة طبيعية، زيوت نباتية مغذية، خلاصة النيلة الزرقاء أو العكر الفاسي الأصلي.','Grains exfoliants naturels, huiles végétales nourrissantes, extrait pur de Nila bleue ou Akar Fassi authentique.','يطبق على بشرة رطبة بحركات دائرية لطيفة مع التركيز على المناطق الجافة ثم يشطف بالماء الدافئ.','Appliquer sur peau humide en mouvements circulaires doux, insister sur les zones rugueuses puis rincer à l’eau tiède.'),(12,1,'Baume à lèvres à l’argan','baume-levres','Ce baume à lèvres naturel à l’huile d’argan et cire d’abeille nourrit et répare les lèvres sèches ou abîmées. Sa formule protectrice prévient le dessèchement et apporte un confort immédiat.','/images/products/baume-levres.jpeg',89.00,1,'2026-09-24 00:19:29.360','2026-09-24 00:19:29.360','بلسم الشفاه بالأركان','Baume à lèvres à l’argan','تغذية، حماية وترطيب مكثف للشفاه بزيت الأركان الطبيعي.','Nutrition, réparation et protection intense à l’huile d’argan.','بلسم شفاه طبيعي غني بزيت الأركان البكر وشمع النحل، مصمم لتغذية الشفاه وحمايتها من الجفاف والتشققات ومنحها نعومة ولمعاناً طبيعياً.','Ce baume à lèvres naturel à l’huile d’argan et cire d’abeille nourrit et répare les lèvres sèches ou abîmées. Sa formule protectrice prévient le dessèchement et apporte un confort immédiat.','زيت الأركان البكر، شمع النحل الطبيعي، زبدة نباتية وفيتامين E.','Huile d’argan pure, cire d’abeille naturelle, beurre végétal et vitamine E.','يوضع على الشفاه عند الحاجة بواسطة الملعقة الخشبية أو أطراف الأصابع.','Appliquer sur les lèvres aussi souvent que nécessaire à l’aide de la spatule ou au doigt.');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scents`
--

DROP TABLE IF EXISTS `scents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `name_ar` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scents_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scents`
--

LOCK TABLES `scents` WRITE;
/*!40000 ALTER TABLE `scents` DISABLE KEYS */;
INSERT INTO `scents` VALUES (1,'Naturel / Sans Parfum','naturel','/images/scents/naturel.png',1,'طبيعي / بدون عطر'),(2,'Fleur d\'oranger','fleur-oranger','/images/scents/fleur-oranger.png',1,'زهر البرتقال'),(3,'Rose de Damas','rose','/images/scents/rose.png',1,'ورد جوري'),(4,'Eucalyptus','eucalyptus','/images/scents/eucalyptus.png',1,'أوكالبتوس'),(5,'Verveine','verveine','/images/scents/verveine.png',1,'لويزة'),(6,'Lavande','lavande','/images/scents/lavande.png',1,'خزامى'),(7,'Argan & Miel','miel','/images/scents/miel.png',1,'أركان وعسل'),(8,'Argan Pur','argan','/images/scents/argan.png',1,'أركان خالص'),(9,'Jasmin','jasmine','/images/scents/jasmine.png',1,'ياسمين'),(10,'Gardénia','gardenia','/images/scents/gardenia.png',1,'غاردينيا'),(11,'Nila Bleue','nila','/images/scents/nila.png',1,'النيلة الزرقاء'),(12,'Akar Fassi','akar-fassi','/images/scents/akar-fassi.png',1,'العكر الفاسي'),(13,'Argan & Hibiscus','hibiscus','/images/scents/hibiscus.png',1,'أركان وكركديه'),(14,'Argan Anti-fourches','anti-fourches','/images/scents/argan.png',1,'أركان ضد التقصف');
/*!40000 ALTER TABLE `scents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `value` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `name_ar` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

LOCK TABLES `sizes` WRITE;
/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
INSERT INTO `sizes` VALUES (1,'50 ml','50 ml',1,'50 مل'),(2,'100 ml','100 ml',1,'100 مل'),(3,'200 ml','200 ml',1,'200 مل'),(4,'250 ml','250 ml',1,'250 مل'),(5,'500 ml','500 ml',1,'500 مل'),(6,'50 g','50 g',1,'50 غ'),(7,'100 g','100 g',1,'100 غ'),(8,'250 g','250 g',1,'250 غ'),(9,'30 ml','30 ml',1,'30 مل'),(10,'200 g','200 g',1,'200 غ'),(11,'500 g','500 g',1,'500 غ'),(12,'20 g','20 g',1,'20 غ');
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-24  0:20:01
