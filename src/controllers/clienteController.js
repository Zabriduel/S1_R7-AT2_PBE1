const { clienteModel } = require('../models/clienteModel');

const clienteController = {
    selecionaTodos: async (req, res) => {
        try {
            const { idCliente } = req.query;

            if (idCliente) {
                const resultadoCliente = await clienteModel.selectById(idCliente);

                if (resultadoCliente.length === 0) {
                    return res.status(200).json({ message: 'Cliente não encontrado.' });
                }

                return res.status(200).json({ data: resultadoCliente });
            }

            const resultado = await clienteModel.selectAll();

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados.' });
            }

            return res.status(200).json({ data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    },

    incluiRegistro: async (req, res) => {
        try {
            const { nome, cpf, email } = req.body;

            if (!nome || !cpf || !email) {
                return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
            }

            if (isNaN(Number(cpf)) || String(cpf).length !== 11) {
                return res.status(400).json({ message: 'CPF inválido!.' });
            }

            const regexEmail = /\S+@\S+\.\S+/;
            if (regexEmail.test(email)) {
                return res.status(400).json({ message: 'email invalido!' });
            }

            const clienteExistenteCpf = await clienteModel.selectByCpf(cpf);
            if (clienteExistenteCpf.length > 0) {
                return res.status(409).json({ message: 'CPF já cadastrado!' });
            }

            const clienteExistenteEmail = await clienteModel.selectByEmail(email);
            if (clienteExistenteEmail.length > 0) {
                return res.status(409).json({ message: 'email já cadastrado!' });
            }

            const resultado = await clienteModel.insert(nome, cpf, email);

            if (!resultado.insertId) {
                throw new Error('Erro ao inserir cliente.');
            }

            res.status(201).json({
                message: 'Cliente cadastrado com sucesso!', id: resultado.insertId
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor', error: error.message
            });
        }
    }
};

module.exports = { clienteController };
