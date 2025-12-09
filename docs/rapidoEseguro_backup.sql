-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: rapidoEseguro
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nome_cliente` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_cad` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_nasc` date NOT NULL,
  `idade` int NOT NULL,
  `status_cliente` varchar(10) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `cpf_UNIQUE` (`cpf`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Juliana Silva','12456776554','juliana.silva@gmail.com','2025-12-02 12:19:23','1992-10-25',33,'ativo'),(3,'João Silva','12345678901','joao@gmail.com','2025-12-02 14:05:51','1992-10-25',33,'ativo'),(8,'Bruno Rafael Teixeira','40852913760','brunorafteixeira@gmail.com','2025-12-04 11:23:37','1995-01-18',30,'inativo'),(11,'Fernando Lima','43198065277','fernando.lima@outlook.com','2025-12-09 11:22:27','1990-12-01',18,'ativo');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_before_delete_clientes` BEFORE DELETE ON `clientes` FOR EACH ROW BEGIN
    
    DELETE FROM telefones WHERE id_cliente = OLD.id_cliente;
	DELETE FROM enderecos WHERE id_cliente = OLD.id_cliente;
    
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enderecos` (
  `id_endereco` int NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(100) NOT NULL,
  `numero_casa` varchar(10) NOT NULL,
  `bairro` varchar(100) NOT NULL,
  `complemento` varchar(150) DEFAULT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `id_cliente` int NOT NULL,
  `cep` varchar(8) NOT NULL,
  PRIMARY KEY (`id_endereco`,`id_cliente`),
  KEY `fk_enderecos_clientes1_idx` (`id_cliente`),
  CONSTRAINT `fk_enderecos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enderecos`
--

LOCK TABLES `enderecos` WRITE;
/*!40000 ALTER TABLE `enderecos` DISABLE KEYS */;
INSERT INTO `enderecos` VALUES (1,'Rua José Borges Gonçalves','280','Residencial Santa Joana','Casa','Sumaré','SP',1,'13181373'),(4,'Rua Santo Antônio','990','Bela Vista do Paraíso','Casa','Telêmaco Borba','PR',8,'84262240'),(9,'2ª Travessa Ester Correia','200','Moradas da Lagoa','Casa dos fundos','Salvador','BA',3,'41307550'),(11,'Rua Santo Antônio','200','Bela Vista do Paraíso','Casa dos fundos','Telêmaco Borba','PR',3,'84262240'),(12,'Rua Gonçalves Dias','300','Batel','Sala 10','Curitiba','PR',11,'80240340');
/*!40000 ALTER TABLE `enderecos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entregas`
--

DROP TABLE IF EXISTS `entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entregas` (
  `id_entregas` int NOT NULL AUTO_INCREMENT,
  `valor_distancia` decimal(10,2) NOT NULL,
  `valor_peso` decimal(10,2) NOT NULL,
  `acrescimo` decimal(10,2) NOT NULL,
  `desconto` decimal(10,2) NOT NULL,
  `taxa_extra` decimal(10,2) NOT NULL,
  `valor_final` decimal(10,2) NOT NULL,
  `id_pedido` int NOT NULL,
  `id_status_entrega` int NOT NULL,
  PRIMARY KEY (`id_entregas`,`id_pedido`,`id_status_entrega`),
  KEY `fk_entregas_pedidos1_idx` (`id_pedido`),
  KEY `fk_entregas_status_entrega1_idx` (`id_status_entrega`),
  CONSTRAINT `fk_entregas_pedidos1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `fk_entregas_status_entrega1` FOREIGN KEY (`id_status_entrega`) REFERENCES `status_entrega` (`id_status_entrega`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entregas`
--

LOCK TABLES `entregas` WRITE;
/*!40000 ALTER TABLE `entregas` DISABLE KEYS */;
INSERT INTO `entregas` VALUES (10,232.29,300.00,106.46,63.88,0.00,574.87,12,1),(11,168.60,19.98,37.72,0.00,0.00,226.30,13,1),(12,232.29,300.00,106.46,63.88,0.00,574.87,14,1),(13,232.29,180.00,82.46,0.00,0.00,494.75,15,1);
/*!40000 ALTER TABLE `entregas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gabriel`@`%`*/ /*!50003 TRIGGER `trg_before_ataulizar_status` BEFORE UPDATE ON `entregas` FOR EACH ROW BEGIN
	DECLARE v_status_anterior VARCHAR (50);
    DECLARE v_novo_status VARCHAR (50);
    
    SET v_status_anterior = (SELECT descricao FROM status_entrega WHERE id_status_entrega = OLD.id_status_entrega);
	SET v_novo_status = (SELECT descricao FROM status_entrega WHERE id_status_entrega = NEW.id_status_entrega);
	IF v_status_anterior = "Cancelado" THEN
		SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Não é possível atualizar o status, pois o pedido já está Cancelado.';
	ELSEIF (v_status_anterior = 'Em transito' OR v_status_anterior = 'Entregue') AND v_novo_status = 'Cancelado' THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Não é possível cancelar um pedido que está Em transito ou Entregue.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gabriel`@`%`*/ /*!50003 TRIGGER `trg_after_update_status` AFTER UPDATE ON `entregas` FOR EACH ROW BEGIN 
	DECLARE status_entrega VARCHAR(50);
    SET status_entrega = (SELECT st.descricao FROM entregas e JOIN status_entrega st ON e.id_status_entrega = st.id_status_entrega WHERE id_pedido = OLD.id_pedido LIMIT 1);
		IF status_entrega = "Em transito" THEN
			INSERT INTO estoque (descricao, id_pedido) VALUES ('PEDIDO  ENVIADO', NEW.id_pedido);
		ELSEIF status_entrega = "Entregue" THEN
			INSERT INTO estoque (descricao, id_pedido) VALUES ('PEDIDO  ENTREGUE', NEW.id_pedido);
		ELSEIF status_entrega = "Cancelado" THEN
			INSERT INTO estoque (descricao, id_pedido) VALUES ('PEDIDO CANCELADO', NEW.id_pedido);
		ELSE 
			INSERT INTO estoque (descricao, id_pedido) VALUES ('EM PROCESSAMENTO', NEW.id_pedido);
		END IF ;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `estoque`
--

DROP TABLE IF EXISTS `estoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estoque` (
  `id_estoque` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `data_movimentacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_pedido` int NOT NULL,
  PRIMARY KEY (`id_estoque`,`id_pedido`),
  KEY `fk_estoque_pedidos1_idx` (`id_pedido`),
  CONSTRAINT `fk_estoque_pedidos1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estoque`
--

LOCK TABLES `estoque` WRITE;
/*!40000 ALTER TABLE `estoque` DISABLE KEYS */;
INSERT INTO `estoque` VALUES (3,'EM PROCESSAMENTO','2025-12-04 13:41:58',10),(5,'EM PROCESSAMENTO','2025-12-04 13:58:06',12),(6,'EM PROCESSAMENTO','2025-12-05 11:10:36',13),(7,'PEDIDO  ENVIADO','2025-12-05 11:40:07',10),(8,'PEDIDO  ENVIADO','2025-12-05 11:40:57',10),(9,'PEDIDO  ENTREGUE','2025-12-05 11:41:35',10),(10,'EM PROCESSAMENTO','2025-12-05 12:25:58',14),(11,'EM PROCESSAMENTO','2025-12-05 12:28:37',15),(13,'EM PROCESSAMENTO','2025-12-05 14:03:31',13),(14,'EM PROCESSAMENTO','2025-12-08 11:03:53',13),(15,'EM PROCESSAMENTO','2025-12-08 11:18:26',13),(16,'EM PROCESSAMENTO','2025-12-08 12:42:00',13),(17,'EM PROCESSAMENTO','2025-12-08 12:42:50',13),(18,'EM PROCESSAMENTO','2025-12-08 12:50:10',13),(19,'EM PROCESSAMENTO','2025-12-08 12:51:48',13),(20,'EM PROCESSAMENTO','2025-12-08 12:52:25',13);
/*!40000 ALTER TABLE `estoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `data_pedido` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `distancia` decimal(12,2) NOT NULL,
  `peso_carga` decimal(10,2) NOT NULL,
  `valor_km` decimal(10,2) NOT NULL,
  `valor_kg` decimal(10,2) NOT NULL,
  `id_cliente` int NOT NULL,
  `id_tipo_entrega` int NOT NULL,
  PRIMARY KEY (`id_pedido`,`id_cliente`,`id_tipo_entrega`),
  KEY `fk_pedidos_clientes1_idx` (`id_cliente`),
  KEY `fk_pedidos_tipo_entrega1_idx` (`id_tipo_entrega`),
  CONSTRAINT `fk_pedidos_clientes1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `fk_pedidos_tipo_entrega1` FOREIGN KEY (`id_tipo_entrega`) REFERENCES `tipo_entrega` (`id_tipo_entrega`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (10,'2025-12-04 13:41:58',8.01,20.00,29.00,15.00,1,1),(12,'2025-12-04 13:58:06',8.01,20.00,29.00,15.00,1,1),(13,'2025-12-05 11:10:36',11.24,2.00,15.00,9.99,1,1),(14,'2025-12-05 12:25:58',8.01,20.00,29.00,15.00,1,1),(15,'2025-12-05 12:28:37',8.01,12.00,29.00,15.00,1,1);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gabriel`@`%`*/ /*!50003 TRIGGER `trg_insere_entrega` AFTER INSERT ON `pedidos` FOR EACH ROW BEGIN
    DECLARE v_valor_distancia DECIMAL(10, 2);
    DECLARE v_valor_peso DECIMAL(10, 2);
    DECLARE v_valor_base DECIMAL(10, 2);
    DECLARE v_valor_acrescimo DECIMAL (10,2);
    DECLARE v_desconto DECIMAL (10,2);
    DECLARE v_taxa_extra DECIMAL (10,2);
    DECLARE v_valor_final DECIMAL (10,2);
    
	SET v_valor_distancia = calcular_valor_distancia(NEW.valor_km, NEW.distancia);
    SET v_valor_peso = calcular_valor_peso(NEW.valor_kg, NEW.peso_carga);
    SET v_valor_base = v_valor_distancia + v_valor_peso;
    SET v_valor_acrescimo = calcular_acrescimo(v_valor_base, NEW.id_tipo_entrega);
    SET v_desconto = calcular_desconto(v_valor_base,v_valor_acrescimo);
    SET v_taxa_extra = calcular_taxa_extra(NEW.peso_carga);
    SET v_valor_final = calcular_valor_final(v_valor_base,v_valor_acrescimo,v_desconto,v_taxa_extra);
    

	INSERT INTO entregas (valor_distancia,valor_peso,acrescimo,desconto,taxa_extra,valor_final,id_pedido,id_status_entrega) VALUES
		(v_valor_distancia,v_valor_peso,v_valor_acrescimo,v_desconto,v_taxa_extra,v_valor_final,NEW.id_pedido,1);

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gabriel`@`%`*/ /*!50003 TRIGGER `trg_insere_estoque` AFTER INSERT ON `pedidos` FOR EACH ROW BEGIN
	INSERT INTO estoque (descricao, id_pedido) VALUES ('EM PROCESSAMENTO', NEW.id_pedido);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gabriel`@`%`*/ /*!50003 TRIGGER `trg_atualiza_entrega` AFTER UPDATE ON `pedidos` FOR EACH ROW BEGIN
    DECLARE v_valor_distancia DECIMAL(10, 2);
    DECLARE v_valor_peso DECIMAL(10, 2);
    DECLARE v_valor_base DECIMAL(10, 2);
    DECLARE v_valor_acrescimo DECIMAL (10,2);
    DECLARE v_desconto DECIMAL (10,2);
    DECLARE v_taxa_extra DECIMAL (10,2);
    DECLARE v_valor_final DECIMAL (10,2);
    
	SET v_valor_distancia = calcular_valor_distancia(NEW.valor_km, NEW.distancia);
    SET v_valor_peso = calcular_valor_peso(NEW.valor_kg, NEW.peso_carga);
    SET v_valor_base = v_valor_distancia + v_valor_peso;
    SET v_valor_acrescimo = calcular_acrescimo(v_valor_base, NEW.id_tipo_entrega);
    SET v_desconto = calcular_desconto(v_valor_base,v_valor_acrescimo);
    SET v_taxa_extra = calcular_taxa_extra(NEW.peso_carga);
    SET v_valor_final = calcular_valor_final(v_valor_base,v_valor_acrescimo,v_desconto,v_taxa_extra);
    

	UPDATE entregas SET valor_distancia = v_valor_distancia, valor_peso = v_valor_peso,acrescimo= v_valor_acrescimo,
    desconto =v_desconto,taxa_extra =v_taxa_extra ,valor_final= v_valor_final WHERE id_pedido = NEW.id_pedido;	

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gabriel`@`%`*/ /*!50003 TRIGGER `trg_before_delete_pedidos` BEFORE DELETE ON `pedidos` FOR EACH ROW BEGIN
	DECLARE status_entrega VARCHAR(50);
    SET status_entrega = (SELECT st.descricao FROM entregas e JOIN status_entrega st ON e.id_status_entrega = st.id_status_entrega WHERE id_pedido = OLD.id_pedido LIMIT 1);
	IF status_entrega != 'Cancelado' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Não é possível excluir este pedido.';
	ELSE 
		DELETE FROM entregas WHERE id_pedido = OLD.id_pedido;
        DELETE FROM estoque  WHERE id_pedido = OLD.id_pedido;
    END IF ;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `status_entrega`
--

DROP TABLE IF EXISTS `status_entrega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_entrega` (
  `id_status_entrega` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(15) NOT NULL,
  PRIMARY KEY (`id_status_entrega`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_entrega`
--

LOCK TABLES `status_entrega` WRITE;
/*!40000 ALTER TABLE `status_entrega` DISABLE KEYS */;
INSERT INTO `status_entrega` VALUES (1,'Calculado'),(2,'Em transito'),(6,'Entregue'),(7,'Cancelado'),(8,'Calculado'),(9,'Em transito'),(10,'Entregue'),(11,'Cancelado');
/*!40000 ALTER TABLE `status_entrega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefones`
--

DROP TABLE IF EXISTS `telefones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefones` (
  `id_telefone` int NOT NULL AUTO_INCREMENT,
  `numero_telefone` varchar(12) NOT NULL,
  `id_cliente` int NOT NULL,
  PRIMARY KEY (`id_telefone`,`id_cliente`),
  UNIQUE KEY `numero_UNIQUE` (`numero_telefone`),
  KEY `fk_telefones_clientes_idx` (`id_cliente`),
  CONSTRAINT `fk_telefones_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefones`
--

LOCK TABLES `telefones` WRITE;
/*!40000 ALTER TABLE `telefones` DISABLE KEYS */;
INSERT INTO `telefones` VALUES (14,'11122334455',1),(1,'12323212345',1),(7,'13686641586',3),(3,'19686541586',3),(15,'41974748899',11),(11,'73686742586',1),(12,'73686746586',1);
/*!40000 ALTER TABLE `telefones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_entrega`
--

DROP TABLE IF EXISTS `tipo_entrega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_entrega` (
  `id_tipo_entrega` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(10) NOT NULL,
  PRIMARY KEY (`id_tipo_entrega`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_entrega`
--

LOCK TABLES `tipo_entrega` WRITE;
/*!40000 ALTER TABLE `tipo_entrega` DISABLE KEYS */;
INSERT INTO `tipo_entrega` VALUES (1,'Urgente'),(2,'Normal'),(3,'Urgente');
/*!40000 ALTER TABLE `tipo_entrega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_dados_clientes`
--

DROP TABLE IF EXISTS `view_dados_clientes`;
/*!50001 DROP VIEW IF EXISTS `view_dados_clientes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_dados_clientes` AS SELECT 
 1 AS `ID_Cliente`,
 1 AS `Nome`,
 1 AS `CPF`,
 1 AS `Email`,
 1 AS `Data_Cadastro`,
 1 AS `Data_Nascimento`,
 1 AS `Idade`,
 1 AS `status_cliente`,
 1 AS `Telefones`,
 1 AS `Enderecos`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_pedidos`
--

DROP TABLE IF EXISTS `view_pedidos`;
/*!50001 DROP VIEW IF EXISTS `view_pedidos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_pedidos` AS SELECT 
 1 AS `Pedido`,
 1 AS `Cliente`,
 1 AS `Data do pedido`,
 1 AS `Distancia`,
 1 AS `Peso`,
 1 AS `Valor por KG`,
 1 AS `Valor por KM`,
 1 AS `Tipo da entrega`,
 1 AS `Valor total`,
 1 AS `Status Pedudo`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_dados_clientes`
--

/*!50001 DROP VIEW IF EXISTS `view_dados_clientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_dados_clientes` AS select `c`.`id_cliente` AS `ID_Cliente`,`c`.`nome_cliente` AS `Nome`,`c`.`cpf` AS `CPF`,`c`.`email` AS `Email`,`c`.`data_cad` AS `Data_Cadastro`,`c`.`data_nasc` AS `Data_Nascimento`,`c`.`idade` AS `Idade`,`c`.`status_cliente` AS `status_cliente`,group_concat(distinct `t`.`numero_telefone` order by `t`.`numero_telefone` ASC separator ', ') AS `Telefones`,json_arrayagg(json_object('logradouro',`e`.`logradouro`,'numero',`e`.`numero_casa`,'bairro',`e`.`bairro`,'complemento',`e`.`complemento`,'cidade',`e`.`cidade`,'estado',`e`.`estado`,'cep',`e`.`cep`)) AS `Enderecos` from ((`clientes` `c` left join `telefones` `t` on((`c`.`id_cliente` = `t`.`id_cliente`))) left join `enderecos` `e` on((`c`.`id_cliente` = `e`.`id_cliente`))) group by `c`.`id_cliente` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_pedidos`
--

/*!50001 DROP VIEW IF EXISTS `view_pedidos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gabriel`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_pedidos` AS select `p`.`id_pedido` AS `Pedido`,`c`.`nome_cliente` AS `Cliente`,`p`.`data_pedido` AS `Data do pedido`,`p`.`distancia` AS `Distancia`,`p`.`peso_carga` AS `Peso`,`p`.`valor_kg` AS `Valor por KG`,`p`.`valor_km` AS `Valor por KM`,`te`.`descricao` AS `Tipo da entrega`,`e`.`valor_final` AS `Valor total`,`se`.`descricao` AS `Status Pedudo` from ((((`pedidos` `p` join `clientes` `c` on((`p`.`id_cliente` = `c`.`id_cliente`))) join `tipo_entrega` `te` on((`p`.`id_tipo_entrega` = `te`.`id_tipo_entrega`))) join `entregas` `e` on((`p`.`id_pedido` = `e`.`id_pedido`))) join `status_entrega` `se` on((`se`.`id_status_entrega` = `e`.`id_status_entrega`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-09  8:37:45
