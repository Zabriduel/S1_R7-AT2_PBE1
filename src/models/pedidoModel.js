const { pool } = require('../config/db');

const pedidoModel = {
    selectById: async (pIdPedido) => {
        const sqlPedido = "SELECT * FROM pedidos WHERE id_pedido =?;"
        const valuesPedido = [pIdPedido];
        const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);

        return rowsPedido
    },
    selectPedidoById: async (pIdPedido) => {
        const sqlPedido = "SELECT c.nome_cliente AS Cliente, p.data_pedido AS 'Data do pedido', p.distancia AS Distancia,p.peso_carga AS Peso,p.valor_kg AS 'Valor por KG',p.valor_km AS 'Valor por KM',te.descricao AS 'Tipo da entrega',e.valor_final AS 'Valor total', se.descricao AS 'Status Pedido' FROM pedidos p JOIN clientes c ON p.id_cliente = c.id_cliente JOIN tipo_entrega te ON p.id_tipo_entrega = te.id_tipo_entrega JOIN entregas e ON p.id_pedido = e.id_pedido JOIN status_entrega se ON se.id_status_entrega = e.id_status_entrega WHERE p.id_pedido =?;"
        const valuesPedido = [pIdPedido];
        const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);

        return rowsPedido 
    },
    selectAllPedidos: async () => {
        const sqlPedido = "SELECT c.nome_cliente AS Cliente, p.data_pedido AS 'Data do pedido', p.distancia AS Distancia,p.peso_carga AS Peso,p.valor_kg AS 'Valor por KG',p.valor_km AS 'Valor por KM',te.descricao AS 'Tipo da entrega',e.valor_final AS 'Valor total', se.descricao AS 'Status Pedido' FROM pedidos p JOIN clientes c ON p.id_cliente = c.id_cliente JOIN tipo_entrega te ON p.id_tipo_entrega = te.id_tipo_entrega JOIN entregas e ON p.id_pedido = e.id_pedido JOIN status_entrega se ON se.id_status_entrega = e.id_status_entrega;";
        const [rowsPedido] = await pool.query(sqlPedido);
        return  rowsPedido ;
    },
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
    deletePedido: async (pIdPedido) => {
        try {
            const sqlPedido = 'DELETE FROM pedidos WHERE id_pedido = ?;';
            const valuesPedido = [pIdPedido];
            const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);
            //  Aciona a trigger: trg_before_delete_pedidos 

            return { rowsPedido };
        } catch (error) {
            throw error;
        }

    }
}

module.exports = { pedidoModel };