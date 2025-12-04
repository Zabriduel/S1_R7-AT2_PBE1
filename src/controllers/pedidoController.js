const { pedidoModel } = require('../models/pedidoModel');
const { clienteModel } = require('../models/clienteModel');
const geolib = require('geolib');

const distanciaCeps = async (pIdEndereco) => {
    try {
        const dadosCliente = await clienteModel.selectEnderecoById(pIdEndereco);

        const dadosCep = await (await fetch(`https://cep.awesomeapi.com.br/json/${dadosCliente[0].cep}`)).json();
        if (dadosCep.code == 'ivalid') {
            return res.status(400).json({ message: dadosCep.message });
        }

        const saidaGalpao = { latitude: -22.81937, longitude: -47.27421 };
        const casaCliente = { latitude: dadosCep.lat, longitude: dadosCep.lng };

        const distanciaMetros = geolib.getDistance(saidaGalpao, casaCliente);
        const distanciaKm = (distanciaMetros / 1000).toFixed(2);

        return distanciaKm;

    } catch (error) {
        console.error("Erro ViaCEP:", error);
        return { erro: true, message: "Erro ao consultar o ViaCEP." };
    }
};

const pedidoController = {
    consultarPedidoPorId: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);

            if (!idPedido || typeof idPedido != 'number') {
                return res.status(200).json({ message: 'Verificar os dados enviados e tente novamete' });
            }

            const resultado = await pedidoModel.selectPedidoById(idPedido);

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados' });
            }
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
            const idEndereco = Number(req.params.idEndereco);
            const idCliente = Number(req.params.idCliente);
            const idTipoEntrega = Number(req.params.idTipoEntrega);

            const { pesoCarga, valorKM, valorKG } = req.body;

            const distanciaKm = await distanciaCeps(idEndereco);

            if (!idCliente || !idTipoEntrega || !distanciaKm || !pesoCarga || !valorKM || !valorKG || typeof idCliente != 'number' || typeof idTipoEntrega != 'number') {
                return res.status(400).json({ message: 'Verificar os dados enviados e tente novamete' });
            }

            const resultado = await pedidoModel.insertPedido(distanciaKm, pesoCarga, valorKM, valorKG, idCliente, idTipoEntrega);

            res.status(201).json({ message: 'Registro incluído com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocoreu um erro no servidor', errorMessage: error.message });
        }
    },
    alterarPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const idEndereco = Number(req.params.idEndereco);
            const { idTipoEntrega, pesoCarga, valorKM, valorKG } = req.body;

            const distanciaKm = await distanciaCeps(idEndereco);

            const pedidoAtual = await pedidoModel.selectById(idPedido);
            if (pedidoAtual.length === 0) {
                return res.status(200).json({ message: 'Pedido não localizado no sistema' });
            }

            const novaDistancia = distanciaKm ?? pedidoAtual[0].distancia;
            console.log(distanciaKm);


            const novoPeso = pesoCarga ?? pedidoAtual[0].peso_carga;
            const novoValorKm = valorKM ?? pedidoAtual[0].valor_km;
            const novoValorKg = valorKG ?? pedidoAtual[0].valor_kg;
            const novoTipoEntrega = idTipoEntrega ?? pedidoAtual[0].id_tipo_entrega;

            console.log(novoTipoEntrega)
            const resultado = await pedidoModel.updatePedido(idPedido, novaDistancia, novoPeso, novoValorKm, novoValorKg, novoTipoEntrega);
            res.status(201).json({ message: 'Pedido atualizado com sucesso.', data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocoreu um erro no servidor', errorMessage: error.message });
        }
    },
    alterarStatusPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const idStatusEntrega = Number(req.params.idStatusEntrega);

            const resultado = await pedidoModel.updateStatusPedido(idStatusEntrega,idPedido);
            res.status(201).json({message:'Status do pedido atualizado com sucesse.', data: resultado});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message});
        }
    },
    deletarPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);

            const resultado = await pedidoModel.deletePedido(idPedido);

            res.status(201).json({ message: 'Registro deletado com sucesso.', data: resultado })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }

    }
}

module.exports = { pedidoController };