const { pool } = require('../config/db');

const clienteModel = {

    selectAll: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectById: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectByCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?;';
        const values = [pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectByEmail: async (pEmail) => {
        const sql = 'SELECT * FROM clientes WHERE email = ?;';
        const values = [pEmail];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    insert: async (pNome, pCpf, pEmail) => {
        const sql = 'INSERT INTO clientes (nome_cliente, cpf, email) VALUES (?, ?, ?);';
        const values = [pNome, pCpf, pEmail];
        const [rows] = await pool.query(sql, values);
        return rows;
    }
};

module.exports = { clienteModel };




