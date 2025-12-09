DELIMITER $$

CREATE FUNCTION calcular_valor_distancia(
	valor_km DECIMAL(10,2),
    distancia DECIMAL(12,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
	BEGIN 
		RETURN distancia*valor_km;
END $$

DELIMITER ;

DELIMITER $$

CREATE FUNCTION calcular_valor_peso(
	valor_peso DECIMAL(10,2),
    distancia DECIMAL(12,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
	BEGIN 
		RETURN distancia*valor_peso;
END $$

DELIMITER ;

DELIMITER $$
CREATE FUNCTION calcular_acrescimo(
	valor_base DECIMAL (10,2),
    tipo_entrega INT
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	DECLARE v_acrescimo DECIMAL(10, 2);
    
    IF tipo_entrega = 1 THEN
        SET v_acrescimo = valor_base * 0.20;
    ELSE
        SET v_acrescimo = 0;
    END IF;

    RETURN v_acrescimo;
END $$

DELIMITER ;

DELIMITER $$
CREATE FUNCTION calcular_desconto(
	valor_base DECIMAL (10,2),
    valor_acrescimo DECIMAL (10,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	DECLARE v_desconto DECIMAL(10, 2);
    DECLARE v_valor_final DECIMAl (10,2);
    
    SET v_valor_final = valor_base + valor_acrescimo;
    IF  v_valor_final >= 500 THEN
        SET v_desconto = v_valor_final * 0.10;
    ELSE
        SET v_desconto = 0;
    END IF;

    RETURN v_desconto;
END $$

DELIMITER ;

DELIMITER $$
CREATE FUNCTION calcular_taxa_extra(
	peso_carga DECIMAL (10,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
DECLARE valor_taxa DECIMAL(10,2);	
    IF  peso_carga > 50 THEN
        SET valor_taxa = 15;
    ELSE
        SET valor_taxa = 0;
    END IF;

    RETURN valor_taxa;
END $$

DELIMITER ;

DELIMITER $$
CREATE FUNCTION calcular_valor_final(
    v_valor_base DECIMAL(10,2),
    v_valor_acrescimo DECIMAL(10,2),
    v_desconto DECIMAL(10,2),
    v_taxa_extra DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN (v_valor_base+v_valor_acrescimo-v_desconto+v_taxa_extra);
    
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_insere_entrega
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
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

END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_insere_estoque
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
	INSERT INTO estoque (descricao, id_pedido) VALUES ('EM PROCESSAMENTO', NEW.id_pedido);
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_atualiza_entrega
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
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

END $$

DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_before_ataulizar_status
BEFORE UPDATE ON entregas
FOR EACH ROW
BEGIN
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
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_before_delete_pedidos
BEFORE DELETE ON pedidos 
FOR EACH ROW
BEGIN
	DECLARE status_entrega VARCHAR(50);
    SET status_entrega = (SELECT st.descricao FROM entregas e JOIN status_entrega st ON e.id_status_entrega = st.id_status_entrega WHERE id_pedido = OLD.id_pedido LIMIT 1);
	IF status_entrega != 'Cancelado' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Não é possível excluir este pedido.';
	ELSE 
		DELETE FROM entregas WHERE id_pedido = OLD.id_pedido;
        DELETE FROM estoque  WHERE id_pedido = OLD.id_pedido;
    END IF ;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_after_update_status
AFTER UPDATE ON entregas
FOR EACH ROW
BEGIN 
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
    END $$
DELIMITER ;

CREATE VIEW view_pedidos AS
SELECT 
	p.id_pedido AS Pedido,
	c.nome_cliente AS Cliente,
    p.data_pedido AS 'Data do pedido',
    p.distancia AS Distancia,
    p.peso_carga AS Peso,
    p.valor_kg AS 'Valor por KG',
    p.valor_km AS 'Valor por KM',
    te.descricao AS 'Tipo da entrega',
    e.valor_final AS 'Valor total',
    se.descricao AS 'Status Pedudo'
FROM pedidos p
	JOIN clientes c
ON p.id_cliente = c.id_cliente
JOIN tipo_entrega te
	ON p.id_tipo_entrega = te.id_tipo_entrega
JOIN entregas e
	ON p.id_pedido = e.id_pedido
JOIN status_entrega se
	ON se.id_status_entrega = e.id_status_entrega;
    
    
    
DELIMITER $$ 
	CREATE TRIGGER trg_before_delete_clientes
    BEFORE DELETE ON clientes
    FOR EACH ROW 
    BEGIN
    
    DELETE FROM telefones WHERE id_cliente = OLD.id_cliente;
	DELETE FROM enderecos WHERE id_cliente = OLD.id_cliente;
    
    END $$
DELIMITER ;


DELIMITER $$
CREATE FUNCTION somar_idade(data_nasc DATE)
RETURNS INT
DETERMINISTIC 
BEGIN
    RETURN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE());
END $$

DELIMITER ;
CREATE EVENT atualizar_idade
    ON SCHEDULE EVERY 1 DAY
    DO
    UPDATE clientes SET idade = somar_idade(data_nasc);
    SELECT * FROM rapidoeseguro.clientes;
    



CREATE VIEW view_dados_clientes AS 
SELECT 
    c.id_cliente AS ID_Cliente,
    c.nome_cliente AS Nome,
    c.cpf AS CPF,
    c.email AS Email,
    c.data_cad AS Data_Cadastro,
    c.data_nasc AS Data_Nascimento,
    c.idade AS Idade,
    c.status_cliente,

    GROUP_CONCAT(DISTINCT t.numero_telefone ORDER BY t.numero_telefone SEPARATOR ', ') AS Telefones,

    JSON_ARRAYAGG(
        JSON_OBJECT(
            'logradouro', e.logradouro,
            'numero', e.numero_casa,
            'bairro', e.bairro,
            'complemento', e.complemento,
            'cidade', e.cidade,
            'estado', e.estado,
            'cep', e.cep
        )
    ) AS Enderecos

FROM clientes c
LEFT JOIN telefones t 
    ON c.id_cliente = t.id_cliente
LEFT JOIN enderecos e 
    ON c.id_cliente = e.id_cliente

GROUP BY 
    c.id_cliente;



