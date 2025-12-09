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



