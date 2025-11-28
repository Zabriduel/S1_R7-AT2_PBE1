const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {
    criarPedido: async (req, res) => {
        try {
            console.log('oiiiii');
            const { idCliente } = req.query.idCliente;
            
            console.log(idCliente);
            // const { idTipoEntrega } = Number(req.param.idTipoEntrega);
            const {  idTipoEntrega,distancia, pesoCarga, valorKM, valorKG } = req.body;

            if (!idCliente, !idTipoEntrega, !distancia, !pesoCarga, !valorKM, !valorKG) {
                return res.status(400).json({ message: 'Verificar os dados enviados e tente novamete' });
            }

            const resultado = await pedidoModel.insertPedido(distancia, pesoCarga, valorKM, valorKG, idCliente,idTipoEntrega);

            res.status(201).json({ message: 'Registro incluído com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({message:'Ocoreu um erro no servidor', errorMessage: error.message});
        }
    }
}

module.exports = { pedidoController };