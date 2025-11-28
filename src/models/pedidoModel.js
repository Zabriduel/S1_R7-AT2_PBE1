const { pool } = require('../config/db');

const pedidoModel = {
    selectPedidoById: async (pIdPedido) => {
        const sqlPedido = "SELECT c.nome_cliente AS Cliente, p.data_pedido AS 'Data do pedido', p.distancia AS Distancia,p.peso_carga AS Peso,p.valor_kg AS 'Valor por KG',p.valor_km AS 'Valor por KM',te.descricao AS 'Tipo da entrega',e.valor_final AS 'Valor total' FROM pedidos p JOIN clientes c ON p.id_cliente = c.id_cliente JOIN tipo_entrega te ON p.id_tipo_entrega = te.id_tipo_entrega JOIN entregas e ON p.id_pedido = e.id_pedido WHERE p.id_pedido =?;"
        const valuesPedido = [pIdPedido];
        const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);

        return { rowsPedido }
    },
    selectAllPedidos: async () => {
        const sqlPedido = "SELECT c.nome_cliente AS Cliente, p.data_pedido AS 'Data do pedido', p.distancia AS Distancia,p.peso_carga AS Peso,p.valor_kg AS 'Valor por KG',p.valor_km AS 'Valor por KM',te.descricao AS 'Tipo da entrega',e.valor_final AS 'Valor total' FROM pedidos p JOIN clientes c ON p.id_cliente = c.id_cliente JOIN tipo_entrega te ON p.id_tipo_entrega = te.id_tipo_entrega JOIN entregas e ON p.id_pedido = e.id_pedido;";
        const [rowsPedido] = await pool.query(sqlPedido);
        return { rowsPedido };
    },
    insertPedido: async (pDistancia, pPesoCarga, pValorKM, pValorKG, pIdCliente, pIdTipoEntrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlPedido = 'INSERT INTO pedidos (distancia,peso_carga,valor_km,valor_kg,id_cliente,id_tipo_entrega) VALUES (?,?,?,?,?,?);';
            const valuesPedido = [pDistancia, pPesoCarga, pValorKM, pValorKG, pIdCliente, pIdTipoEntrega];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            connection.commit();
            return { rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }

    }
}

module.exports = { pedidoModel };