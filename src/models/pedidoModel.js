const { poll } = require('../config/db');

const pedidoModel = {
    insertPedido: async (pTipoEntrega, pDistancia, pPesoCarga, pValorKM, pValorKG, pIdCliente) => {
        const connection = await poll.getConnectio();
        try {
            await connection.beginTransaction();
            const sqlPedido = 'INSERT INTO pedidos (tipo_entrega,distancia,peso_carga,valor_km,valor_kg,id_cliente) VALUES (?,?,?,?,?,?)';
            const valuesPedido = [pTipoEntrega, pDistancia,pPesoCarga, pValorKM, pValorKG, pIdCliente];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            return { rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }
}

module.exports = { pedidoModel };