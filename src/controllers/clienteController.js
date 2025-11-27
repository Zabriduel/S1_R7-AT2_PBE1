const { clienteModel } = require('../models/clienteModel');

const clienteController = {

    selecionaTodos: async (params) => {
        
        
    },

    incluiRegistro: async (req, res) => {
        try {
            const { nome, cpf } = req.body;

            if (!nome || !cpf || isNaN(Number(cpf)) || String(cpf).length !== 11) {
                return res.status(400).json({ message: 'Verifique os dados enviados!' });
            }

            const clienteExistente = await clienteModel.selectByCpf(cpf);
            if (clienteExistente.length > 0) {
                return res.status(409).json({ message: 'CPF já cadastrado!' });
            }


            const resultado = await clienteModel.insert(nome, cpf);

            if (!resultado.insertId) {
                throw new Error('Erro ao inserir cliente.');
            }

            res.status(201).json({ message: 'Cliente cadastrado com sucesso!', id: resultado.insertId });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', error: error.message });
        }
    },

}