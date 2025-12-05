const { pool } = require('../config/db');

const clienteModel = {

    selectAll: async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectClientesPorId: async (pIdCliente) => {
        const sql = 'SELECT * FROM view_dados_clientes WHERE ID_Cliente=?';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql,values);
        return rows;
    },

    selectById: async (pIdCliente) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectByCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?';
        const values = [pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectByEmail: async (pEmail) => {
        const sql = 'SELECT * FROM clientes WHERE email = ?';
        const values = [pEmail];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectTelefoneById: async (pIdTelefone) => {
        const sql = 'SELECT * FROM telefones WHERE id_telefone = ?';
        const values = [pIdTelefone];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectEnderecoById: async (idEndereco) => {
        const sql = 'SELECT * FROM enderecos WHERE id_endereco = ?;';
        const values = [idEndereco];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectPedidosByCliente: async (idCliente) => {
        const sql = 'SELECT * FROM pedidos WHERE id_cliente = ?;';
        const values = [idCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectTelefoneById: async (idTelefone) => {
        const sql = ' SELECT *FROM telefones WHERE id_telefone = ?;';
        const values = [idTelefone];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    insertCliente: async (pNome, pCpf, pEmail, pData_nasc, pIdade, pStatus = "ativo") => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO clientes (nome_cliente, cpf, email, data_nasc, idade, status_cliente) VALUES (?, ?, ?, ?, ?, ?);';
            const values = [pNome, pCpf, pEmail, pData_nasc, pIdade, pStatus];
            const [rows] = await connection.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    insertTelefone: async (pIdCliente, pNumeroTelefone) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO telefones (id_cliente, numero_telefone) VALUES (?, ?)';
            const values = [pIdCliente, pNumeroTelefone];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    insertEndereco: async (pIdCliente, pLogradouro, pNumeroCasa, pBairro, pCidade, pEstado, pCep, pComplemento) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO enderecos (id_cliente, logradouro, numero_casa, bairro, cidade, estado, cep, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [pIdCliente, pLogradouro, pNumeroCasa, pBairro, pCidade, pEstado, pCep, pComplemento];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    updateCliente: async (pIdCliente, pNome, pCpf, pEmail) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'UPDATE clientes SET nome_cliente = ?, cpf = ?, email = ? WHERE id_cliente = ?;';
            const values = [pNome, pCpf, pEmail, pIdCliente];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    updateTelefone: async (pIdTelefone, pNumeroTelefone) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'UPDATE telefones SET numero_telefone = ? WHERE id_telefone = ?;';
            const values = [pNumeroTelefone, pIdTelefone];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

    updateEndereco: async (idEndereco, dados) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = `
            UPDATE enderecos 
            SET cep = ?, logradouro = ?, bairro = ?, cidade = ?, estado = ?, complemento = ?, numero_casa = ?
            WHERE id_endereco = ?;
        `;

            const values = [
                dados.cep,
                dados.logradouro,
                dados.bairro,
                dados.cidade,
                dados.estado,
                dados.complemento,
                dados.numero,
                idEndereco
            ];

            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

    updateStatus: async (idCliente, novoStatus) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'UPDATE clientes SET status_cliente = ? WHERE id_cliente = ?;';
            const values = [novoStatus, idCliente];
            const [result] = await pool.query(sql, values);
            connection.commit();
            return result;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

    deleteCliente: async (idCliente) => {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?;";
        const values = [idCliente]
        const [result] = await pool.query(sql, values);
        // Aciona a TRIGGER: trg_before_delete_clientes;
        return result;
    },

    countEnderecos: async (idCliente) => {
        const sql = "SELECT COUNT(*) AS total FROM enderecos WHERE id_cliente = ?";
        const values = [idCliente];
        const [rows] = await pool.query(sql, values);
        return rows[0].total;
    },

    deleteEnderecoById: async (idEndereco) => {
        const sql = "DELETE FROM enderecos WHERE id_endereco = ?";
        const values = [idEndereco]
        const [result] = await pool.query(sql, values);
        return result;
    },

    countTelefones: async (idCliente) => {
        const sql = 'SELECT COUNT(*) AS total FROM telefones WHERE id_cliente = ?;';
        const values = [idCliente];
        const [rows] = await pool.query(sql, values);
        return rows[0].total;
    },

    deleteTelefoneById: async (idTelefone) => {
        const sql = 'DELETE FROM telefones WHERE id_telefone = ?;';
        const values = [idTelefone];
        const [result] = await pool.query(sql, values);
        return result;
    },

}

module.exports = { clienteModel };
