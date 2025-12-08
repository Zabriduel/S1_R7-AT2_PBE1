const { entregaModel } = require('../models/entregaModel');

const entregaController = {

    /**
     * Função para consultar uma entrega pelo ID
     * Rota GET /entregas/:idEntrega
     * @async
     * @function consultarEntregaPorId
     * @param {Object} req Objeto da requisição contendo o parâmetro idEntrega
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Array<Object>>}
     * @example
     * // resposta:
     * {
     *   "data": [{ "id_entregas": 10, "valor_final": 89.5, ... }]
     * }
     */
    consultarEntregaPorId: async (req, res) => {
        try {
            const idEntrega = Number(req.params.idEntrega);

            if (!idEntrega || typeof idEntrega !== 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente.' });
            }

            const resultado = await entregaModel.selectById(idEntrega);

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados.' });
            }

            return res.status(200).json({ data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    /**
     * Função para consultar uma entrega pelo ID do pedido
     * Rota GET /entregas/pedido/:idPedido
     * @async
     * @function consultarEntregaPorPedido
     * @param {Object} req Objeto da requisição contendo o idPedido
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Array<Object>>}
     */
    consultarEntregaPorPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);

            if (!idPedido || typeof idPedido !== 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente.' });
            }

            const resultado = await entregaModel.selectByPedidoId(idPedido);

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Nenhuma entrega encontrada para este pedido.' });
            }

            return res.status(200).json({ data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    },

    /**
     * Função para consultar todas as entregas cadastradas
     * Rota GET /entregas
     * @async
     * @function consultarEntregas
     * @param {Object} req Objeto da requisição
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Array<Object>>}
     */
    consultarEntregas: async (req, res) => {
        try {
            const resultado = await entregaModel.selectAll();

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados.' });
            }

            return res.status(200).json({ data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    /**
     * Função bloqueada para criação manual de entregas
     * As entregas são geradas automaticamente pela TRIGGER: trg_insere_entrega
     * quando um novo pedido é inserido.
     *
     * Rota: POST /entregas
     * @async
     * @function criarEntrega
     * @param {Object} req Objeto da requisição HTTP
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Object>} Retorna mensagem informando que o processo é automático
     * @example
     * // resposta:
     * {
     *   "message": "Entregas são criadas automaticamente ao inserir um pedido. Use POST /pedidos."
     * }
     */
    criarEntrega: async (req, res) => {
        return res.status(403).json({ message: 'Entregas são criadas automaticamente ao inserir um pedido. Use POST /pedidos.' });
    },


    /**
     * Função bloqueada para alteração manual de entregas
     * Os valores da entrega (acréscimos, descontos, total, etc.)
     * são recalculados automaticamente pelas TRIGGER: trg_atualiza_entrega
     * sempre que um pedido é alterado.
     *
     * Rota: PATCH /entregas/:idEntrega
     * @async
     * @function alterarEntrega
     * @param {Object} req Objeto da requisição HTTP
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Object>} Retorna mensagem informando que o processo é automático
     * @example
     * // resposta:
     * {
     *   "message": "Entregas são recalculadas automaticamente ao alterar um pedido."
     * }
     */
    alterarEntrega: async (req, res) => {
        return res.status(403).json({ message: 'Entregas são recalculadas automaticamente ao alterar um pedido. Use PATCH /pedidos/:idPedido/endereco/:idEndereco.' });
    },

    deletarEntrega: async (req, res) => {
        try {
            const idEntrega = Number(req.params.idEntrega);

            if (!idEntrega || typeof idEntrega !== 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente.' });
            }

            const resultado = await entregaModel.deleteEntrega(idEntrega);

            return res.status(200).json({ message: 'Registro deletado com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }

};

module.exports = { entregaController };
