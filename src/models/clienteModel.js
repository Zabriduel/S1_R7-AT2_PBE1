const { pool } = require('../config/db');

const clienteModel = {

    selectAll: async () => {
        const sql = "SELECT * FROM clientes";
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectById: async (pIdCliente) => {
        const sql = "SELECT * FROM clientes WHERE id_cliente = ?";
        const [rows] = await pool.query(sql, [pIdCliente]);
        return rows;
    },

    selectByCpf: async (pCpf) => {
        const sql = "SELECT * FROM clientes WHERE cpf = ?";
        const [rows] = await pool.query(sql, [pCpf]);
        return rows;
    },

    selectByEmail: async (pEmail) => {
        const sql = "SELECT * FROM clientes WHERE email = ?";
        const [rows] = await pool.query(sql, [pEmail]);
        return rows;
    },

    insertCliente: async (pNome, pCpf, pEmail, pDataNasc, pIdade) => {
        const sql = "INSERT INTO clientes (nome_cliente, cpf, email, data_nasc, idade) VALUES (?, ?, ?, ?, ?)";
        const values = [pNome, pCpf, pEmail, pDataNasc, pIdade];

        const [rows] = await pool.query(sql, values);
        return rows;
    },


    insertTelefone: async (pIdCliente, pTelefone) => {
        const sql = "INSERT INTO telefones (id_cliente, numero) VALUES (?, ?)";
        const values = [pIdCliente, pTelefone];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    insertEndereco: async (pIdCliente, pLogradouro, pNumero, pBairro, pCidade, pEstado, pCep, pComplemento) => {
        const sql = 'INSERT INTO enderecos (id_cliente, logradouro, numero, bairro, cidade, estado, cep, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        const values = [pIdCliente, pLogradouro, pNumero, pBairro, pCidade, pEstado, pCep, pComplemento];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    updateCliente: async (pIdCliente, pNome, pCpf, pEmail) => {
        const sql = 'UPDATE clientes SET nome_cliente = ?, cpf = ?, email = ? WHERE id_cliente = ?;';
        const values = [pNome, pCpf, pEmail, pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

};

module.exports = { clienteModel };



