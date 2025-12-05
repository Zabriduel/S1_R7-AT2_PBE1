const { pool } = require('../config/db');

const pedidoModel = {
    /**
     * Retorna um pedido cadastrado com todas as informações sobre ele
     * @async
     * @function selectById
     * @param {number} pIdPedido Recebe o valor único do pedido que será consultado
     * @returns  {Promise<Array<Object>>}
     * @example 
     * const pedidos = await pedidoModel.selectById(idPedido);
     * console.log(pedidos);
     * // Saída esperada
     * [
     *      {coluna1: "Valor coluna1", coluna2: "Valor coluna 2", ...},
     * ]
     */
    selectById: async (pIdPedido) => {
        const sqlPedido = "SELECT * FROM pedidos WHERE id_pedido =?;"
        const valuesPedido = [pIdPedido];
        const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);

        return rowsPedido
    },
    /**
     * Retorna um pedido cadastrado com todas as informações relevantes sobre ele
     * @async
     * @function selectPedidoById
     * @param {number} pIdPedido Recebe o valor único do pedido que será consultado
     * @returns  {Promise<Array<Object>>}
     * @example 
     * const pedidos = await pedidoModel.selectPedidoById(idPedido);
     * console.log(pedidos);
     * // Saída esperada
     * [
     *      {coluna1: "Valor coluna1", coluna2: "Valor coluna 2", ...},
     * ]
     */
    selectPedidoById: async (pIdPedido) => {
        const sqlPedido = "SELECT * FROM view_pedidos WHERE Pedido=?"
        const valuesPedido = [pIdPedido];
        const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);

        return rowsPedido
    },
    /**
     * Retornar todos os pedidos encontrados
     * @async
     * @function selectAllPedidos
     * @returns {Promise<Array<Object>>}
     * @example 
     * const pedidos = await pedidoModel.selectAllPedidos();
     * console.log(pedidos);
     * // Saída esperada
     * [
     *      {coluna1: "Valor coluna1", coluna2: "Valor coluna 2", ...},
     *      {coluna1: "Valor coluna1", coluna2: "Valor coluna 2", ...},
     * ]
     */
    selectAllPedidos: async () => {
        const sqlPedido = "SELECT * FROM view_pedidos";
        const [rowsPedido] = await pool.query(sqlPedido);
        return rowsPedido;
    },
    /**
     * Cadastra 
     * 
     * @param {number} pDistancia Recebe o valor da distância entre a empresa e o cliente
     * @param {number} pPesoCarga Recebe o valor do peso da entrega em kg
     * @param {number} pValorKM Recebe o valor por KM da entrega
     * @param {number} pValorKG Recebe o valor por KG da entrega
     * @param {number} pIdCliente Recebe o valor único do cliente
     * @param {number} pIdTipoEntrega  Recebe o valor único do tipo de entrega
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query.
     * @example
     * const resultado = await pedidoModel.updatePedido(idPedido, novaDistancia, novoPeso, novoValorKm, novoValorKg, novoTipoEntrega);
     *  "resultado":{
     *      "fieldCount" : 0,
     *      "affectedRows": 1,
     *      "insertId": 1,
     *      "info": "",
     *      "serverStatus": 2,
     *      "warningStatus": 0,
     *      "changedRows": 0 
     * }
     * 
     */
    insertPedido: async (pDistancia, pPesoCarga, pValorKM, pValorKG, pIdCliente, pIdTipoEntrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlPedido = 'INSERT INTO pedidos (distancia,peso_carga,valor_km,valor_kg,id_cliente,id_tipo_entrega) VALUES (?,?,?,?,?,?);';
            const valuesPedido = [pDistancia, pPesoCarga, pValorKM, pValorKG, pIdCliente, pIdTipoEntrega];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            // aciona as TRIGGERS: trg_insere_entrega e trg_insere_estoque;

            connection.commit();
            return { rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },
    /**
     * Função para atualizar informações do pedido
     * @param {number} pIdPedido Recebe o valor único do pedido
     * @param {number} pDistancia Recebe o valor da distância entre a empresa e o cliente
     * @param {number} pPesoCarga Recebe o valor do peso da entrega em kg
     * @param {number} pValorKM Recebe o valor por KM da entrega
     * @param {number} pValorKG Recebe o valor por KG da entrega
     * @param {number} pIdTipoEntrega Recebe o valor único do tipo de entrega
     * @returns 
     * @example
     * const resultado = await pedidoModel.updatePedido(idPedido, novaDistancia, novoPeso, novoValorKm, novoValorKg, novoTipoEntrega);
	 *	"resultado": {
	 *		"fieldCount": 0,
	 *		"affectedRows": 1,
	 *		"insertId": 0,
	 *		"info": "Rows matched: 1  Changed: 1  Warnings: 0",
	 *		"serverStatus": 3,
	 *		"warningStatus": 0,
	 *		"changedRows": 1
	 *	}
	 *
     */
    updatePedido: async (pIdPedido, pDistancia, pPesoCarga, pValorKM, pValorKG, pIdTipoEntrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlPedido = 'UPDATE pedidos SET distancia =?, peso_carga =?, valor_km =?,valor_kg=?,id_tipo_entrega=? WHERE id_pedido =?'
            const valuesPedido = [pDistancia, pPesoCarga, pValorKM, pValorKG, pIdTipoEntrega, pIdPedido];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            // aciona a trigger: trg_atualiza_entrega
            connection.commit();
            return { rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    /**
     * 
     * @param {number} pIdStatusEntrega  Recebe o valor único do status de entrega
     * @param {number} pIdPedido  Recebe o valor único do pedido
     * @returns 
     * @example
     * const resultado = await pedidoModel.updateStatusPedido(idStatusEntrega, idPedido);
 	 *	"resultado": {
	 *		"fieldCount": 0,
	 *		"affectedRows": 1,
	 *		"insertId": 0,
	 *		"info": "Rows matched: 1  Changed: 1  Warnings: 0",
	 *		"serverStatus": 3,
	 *		"warningStatus": 0,
	 *		"changedRows": 1
	 *	}
     */
    updateStatusPedido: async (pIdStatusEntrega, pIdPedido) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlPedido = 'UPDATE entregas SET id_status_entrega =? WHERE id_pedido =?';
            const valuesPedido = [pIdStatusEntrega, pIdPedido];
            const { rowsPedido } = await connection.query(sqlPedido, valuesPedido);

            // aciona a trigger: trg_before_ataulizar_status

            connection.commit();
            return { rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    /**
     * 
     * @param {*} pIdPedido 
     * @returns 
     */
    deletePedido: async (pIdPedido) => {
        const sqlPedido = 'DELETE FROM pedidos WHERE id_pedido = ?;';
        const valuesPedido = [pIdPedido];
        const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);
        //  Aciona a trigger: trg_before_delete_pedidos 

        return { rowsPedido };

    }
}

module.exports = { pedidoModel };