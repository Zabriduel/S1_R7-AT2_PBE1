const { pool } = require('../config/db');
const clienteModel = {

    selectAll: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },


    insert: async(pNome, pCpf, pEmail) => {
        const sqlCliente = 'INSERT INTO clientes (nome_cliente, cpf, email) VALUES (?, ?, ?);';
        const valuesCliente = [pNome, pCpf, pEmail];
        const [rowsCliente] = await connection.query(sqlCliente,valuesCliente);

        // const sqlEndereco = 'INSERT INTO enderecos (id_cliente, rua, numero, bairro, cidade, estado, cep) VALUES (?,?,?,?,?,?,?);';
        // const valuesEndereco = []
        return rowsCliente;
    },








}