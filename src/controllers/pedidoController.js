const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {
    criarPedido: async (req, res) => {
        try {
            const { IdCliente } = Number(req.param.IdCliente);
            const { tipoEntrega, distancia, pesoCarga, valorKM, valorKG } = req.body;

            if (!IdCliente, !tipoEntrega, !distancia, !pesoCarga, !valorKM, valorKG) {
                return res.status(400).json({ message: 'Verificar os dados enviados e tente novamete' });
            }

            const resultado = await pedidoModel.insertPedido(tipoEntrega, distancia, pesoCarga, valorKM, valorKG, IdCliente);

            res.status(201).json({ message: 'Registro incluído com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({message:'Ocoreu um erro no servidor', errorMessage: error.message});
        }
    }
}

module.exports = { pedidoController };