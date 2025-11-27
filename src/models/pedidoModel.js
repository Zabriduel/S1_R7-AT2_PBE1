const { poll } = require('../config/db');

const pedidoModel = {
    insertPedido: async ( pDistancia, pPesoCarga, pValorKM, pValorKG, pIdCliente,pIdTipoEntrega) => {
        const connection = await poll.getConnection();
        try {
            await connection.beginTransaction();
            const sqlPedido = 'INSERT INTO pedidos (distancia,peso_carga,valor_km,valor_kg,id_cliente,id_tipo_entrega) VALUES (?,?,?,?,?,?)';
            const valuesPedido = [pDistancia,pPesoCarga, pValorKM, pValorKG, pIdCliente, pIdTipoEntrega];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            return { rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }
}

module.exports = { pedidoModel };