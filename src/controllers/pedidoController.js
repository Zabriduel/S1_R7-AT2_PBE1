const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {
    consultarPedidoPorId: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);

            if (!idPedido || typeof idPedido != 'number') {
                return res.status(200).json({ message: 'Verificar os dados enviados e tente novamete' });
            }
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados' });
            }

            const resultado = await pedidoModel.selectPedidoById(idPedido);
            return res.status(200).json({ data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.errorMessage });
        }
    },
    consultaPedidos: async (req, res) => {
        try {
            const resultado = await pedidoModel.selectAllPedidos();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados' });
            }
            return res.status(200).json({ data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.errorMessage });
        }
    },
    criarPedido: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            const idTipoEntrega = Number(req.params.idTipoEntrega);

            const { distancia, pesoCarga, valorKM, valorKG } = req.body;

            if (!idCliente || !idTipoEntrega || !distancia || !pesoCarga || !valorKM || !valorKG || typeof idCliente != 'number' || typeof idTipoEntrega != 'number') {
                return res.status(400).json({ message: 'Verificar os dados enviados e tente novamete' });
            }

            const resultado = await pedidoModel.insertPedido(distancia, pesoCarga, valorKM, valorKG, idCliente, idTipoEntrega);

            res.status(201).json({ message: 'Registro incluído com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocoreu um erro no servidor', errorMessage: error.message });
        }
    }
}

module.exports = { pedidoController };