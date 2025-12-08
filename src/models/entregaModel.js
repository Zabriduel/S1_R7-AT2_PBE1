const { pool } = require('../config/db');

const entregaModel = {
    /**
     * Retorna uma entrega completa baseada no ID da entrega
     * @async
     * @function selectById
     * @param {number} pIdEntrega Valor único da entrega
     * @returns {Promise<Array<Object>>}
     * @example
     * const entrega = await entregaModel.selectById(1);
     */
    selectById: async (pIdEntrega) => {
        const sql = "SELECT * FROM entregas WHERE id_entregas = ?;";
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Retorna a entrega vinculada a um pedido específico
     * @async
     * @function selectByPedidoId
     * @param {number} pIdPedido Valor único do pedido
     * @returns {Promise<Array<Object>>}
     * @example
     * const entrega = await entregaModel.selectByPedidoId(10);
     */
    selectByPedidoId: async (pIdPedido) => {
        const sql = "SELECT * FROM entregas WHERE id_pedido = ?;";
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Retorna todas as entregas
     * @async
     * @function selectAll
     * @returns {Promise<Array<Object>>}
     * @example
     * const entrega = await entregaModel.selectByPedidoId();
     */
    selectAll: async () => {
        const sql = "SELECT * FROM entregas;";
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Insere uma nova entrega
     * Importante: normalmente é inserida automaticamente pela trigger: trg_insere_entrega.
     * 
     * @async
     * @function insertEntrega
     * @param {number} pValorDistancia 
     * @param {number} pValorPeso 
     * @param {number} pAcrescimo 
     * @param {number} pDesconto 
     * @param {number} pTaxaExtra 
     * @param {number} pValorFinal 
     * @param {number} pIdPedido 
     * @param {number} pIdStatusEntrega 
     * @returns {Promise<Object>}
     */
    insertEntrega: async (pValorDistancia,pValorPeso,pAcrescimo,pDesconto,pTaxaExtra,pValorFinal,pIdPedido,pIdStatusEntrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const sql = `INSERT INTO entregas (valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, id_pedido, id_status_entrega)VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
            const values = [pValorDistancia,pValorPeso,pAcrescimo,pDesconto,pTaxaExtra,pValorFinal,pIdPedido,pIdStatusEntrega];
            const [rows] = await connection.query(sql, values);

            await connection.commit();
            return { rows };

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Atualiza uma entrega pelo ID
     * Importante: atualização é feita de forma automatica alterando o pedido pelo trigger: trg_atualiza_entrega
     * @async
     * @function updateEntrega
     * @param {number} pIdEntrega 
     * @param {number} pValorDistancia 
     * @param {number} pValorPeso 
     * @param {number} pAcrescimo 
     * @param {number} pDesconto 
     * @param {number} pTaxaExtra 
     * @param {number} pValorFinal 
     * @param {number} pIdStatusEntrega 
     * @returns {Promise<Object>}
     */
    updateEntrega: async (pIdEntrega,pValorDistancia,pValorPeso,pAcrescimo,pDesconto,pTaxaExtra,pValorFinal,pIdStatusEntrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const sql = `UPDATE entregas SET valor_distancia=?, valor_peso=?, acrescimo=?, desconto=?, taxa_extra=?, valor_final=?, id_status_entrega=?WHERE id_entregas=?;`;
            const values = [ pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxaExtra, pValorFinal, pIdStatusEntrega, pIdEntrega];
            const [rows] = await connection.query(sql, values);

            await connection.commit();
            return { rows };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Deleta uma entrega pelo ID
     * @async
     * @function deleteEntrega
     * @param {number} pIdEntrega
     * @returns {Promise<Object>}
     */
    deleteEntrega: async (pIdEntrega) => {
        const sql = 'DELETE FROM entregas WHERE id_entregas = ?;';
        const [rows] = await pool.query(sql, [pIdEntrega]);
        return { rows };
    }
};

module.exports = { entregaModel };
