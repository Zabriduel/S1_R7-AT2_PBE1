const { pedidoModel } = require('../models/pedidoModel');
const { funcoesUteis } = require('../utils/utils');


const pedidoController = {
    /**
     * Função para consultar um pedido pelo ID
     * Rota GET /pedidos/:idPedido
     * @async
     * @function consultarPedidoPorId
     * @param {Object} req Objeto da requisição contendo o parâmetro idPedido
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Array<Object>>} Retorna os dados do pedido ou mensagem de erro
     * @example
     * 
     * // resposta:
     * {
     *   "data": [{ "id_pedido": 5, "distancia": 12.5, ... }]
     * }
     */
    consultarPedidoPorId: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);

            if (!idPedido || typeof idPedido != 'number') {
                return res.status(200).json({ message: 'Verifique os dados enviados e tente novamete' });
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
    /**
 * Função para consultar todos os pedidos cadastrados
 * Rota GET /pedidos
 * @async
 * @function consultaPedidos
 * @param {Object} req Objeto da requisição
 * @param {Object} res Objeto de resposta HTTP
 * @returns {Promise<Array<Object>>} Retorna todos os pedidos ou mensagem caso vazio
 * @example
 * 
 * // resposta:
 * {
 *   "data": [
 *      { "id_pedido": 1, ... },
 *      { "id_pedido": 2, ... }
 *   ]
 * }
 */
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
    /**
     * Função para criar um novo pedido
     * Rota POST /pedidos/:idCliente/:idEndereco/:idTipoEntrega
     * @async
     * @function criarPedido
     * @param {Object} req Objeto da requisição contendo parâmetros e corpo JSON
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso e dados inseridos
     * @example
     * 
     * {
     *   "pesoCarga": 50,
     *   "valorKM": 2.5,
     *   "valorKG": 1.2
     * }
     *
     * // resposta:
     * {
     *   "message": "Registro incluído com sucesso.",
     *   "data": { "insertId": 15, ... }
     * }
     */
    criarPedido: async (req, res) => {
        try {
            const idEndereco = Number(req.params.idEndereco);
            const idCliente = Number(req.params.idCliente);
            const idTipoEntrega = Number(req.params.idTipoEntrega);

            const { pesoCarga, valorKM, valorKG } = req.body;

            if (!idCliente || !idEndereco || !idTipoEntrega || !pesoCarga || !valorKM || !valorKG || typeof idCliente != 'number' || typeof idEndereco != 'number' || typeof idTipoEntrega != 'number' || typeof pesoCarga != 'number' || typeof valorKM != 'number' || typeof valorKG != 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamete' });
            }


            const distanciaKm = await funcoesUteis.calcularDistancia(idEndereco);
            const resultado = await pedidoModel.insertPedido(distanciaKm, pesoCarga, valorKM, valorKG, idCliente, idTipoEntrega);

            res.status(201).json({ message: 'Registro incluído com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocoreu um erro no servidor', errorMessage: error.message });
        }
    },
    /**
     * Função para alterar um pedido existente
     * Rota PUT /pedidos/:idPedido/endereco/:idEndereco
     * @async
     * @function alterarPedido
     * @param {Object} req Objeto da requisição contendo parâmetros e corpo JSON
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Object>} Retorna mensagem e resultado da atualização
     * @example
     * 
     * {
     *   "pesoCarga": 40,
     *   "valorKM": 3.0,
     *   "valorKG": 1.4,
     *   "idTipoEntrega": 2
     * }
     * 
     * // resposta:
     * 
     *  "rowsPedido": {
     *		"fieldCount": 0,
     *		"affectedRows": 1,
     *		"insertId": 0,
     *		"info": "Rows matched: 1  Changed: 0  Warnings: 0",
     *		"serverStatus": 3,
     *		"warningStatus": 0,
     *		"changedRows": 0
     *	}
     */
    alterarPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const idEndereco = Number(req.params.idEndereco);
            const { idTipoEntrega, pesoCarga, valorKM, valorKG } = req.body;

            if (!idPedido || !idEndereco || (!idTipoEntrega || typeof idTipoEntrega != 'number') || (!pesoCarga || typeof pesoCarga != 'number') || (!valorKM || typeof valorKM != 'number') || (!valorKG || typeof valorKG != 'number') || typeof idPedido != 'number' || typeof idEndereco != 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamete' });
            }

            const distanciaKm = await funcoesUteis.calcularDistancia(idEndereco);

            const pedidoAtual = await pedidoModel.selectById(idPedido);
            if (pedidoAtual.length === 0) {
                return res.status(200).json({ message: 'Pedido não localizado no sistema' });
            }

            const novaDistancia = distanciaKm ?? pedidoAtual[0].distancia;

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
    /**
 * Função para alterar o status de um pedido
 * Rota PATCH /pedidos/:idPedido/status/:idStatusEntrega
 * @async
 * @function alterarStatusPedido
 * @param {Object} req Objeto da requisição contendo idPedido e idStatusEntrega
 * @param {Object} res Objeto de resposta HTTP
 * @returns {Promise<Object>} Mensagem e resultado da atualização
 * @example
 * 
 * // resposta:
 * { "message": "Status do pedido atualizado com sucesso."}
 */
    alterarStatusPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const idStatusEntrega = Number(req.params.idStatusEntrega);

            await pedidoModel.updateStatusPedido(idStatusEntrega, idPedido);
            res.status(201).json({ message: 'Status do pedido atualizado com sucesso.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    /**
 * Função para excluir um pedido pelo ID
 * Rota DELETE /pedidos/delete/:idPedido
 * @async
 * @function deletarPedido
 * @param {Object} req Objeto da requisição contendo idPedido
 * @param {Object} res Objeto de resposta HTTP
 * @returns {Promise<Object>} Mensagem de sucesso e resultado da exclusão
 * @example
 * 
 * // resposta:
 * {
 *   "message": "Registro deletado com sucesso.",
 *   "data": { "affectedRows": 1... }
 * }
 */
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