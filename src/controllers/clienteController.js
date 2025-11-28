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
            const { nome, cpf, email, telefone, cep, numero, complemento, data_nasc, idade } = req.body;

            if (!nome || !cpf || !email || !telefone || !cep || !numero || !data_nasc || !idade) {
                return res.status(400).json({ message: 'Preencha todos os dados obrigatórios!' });
            }

            if (isNaN(Number(idade))) {
                return res.status(400).json({ message: "Idade inválida!" });
            }

            if (String(cpf).length !== 11 || isNaN(Number(cpf))) {
                return res.status(400).json({ message: 'CPF inválido!' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'email inválido!' });
            }

            const dadosCep = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();

            if (dadosCep.erro) {
                return res.status(400).json({ message: "CEP inválido!" });
            }

            const cliente = await clienteModel.insertCliente(nome, cpf, email, data_nasc, idade);
            const idCliente = cliente.insertId;

            await clienteModel.insertTelefone(idCliente, telefone);

            await clienteModel.insertEndereco(
                idCliente,
                dadosCep.logradouro,
                numero,
                dadosCep.bairro,
                dadosCep.localidade,
                dadosCep.uf,
                cep,
                complemento || null
            );

            return res.status(201).json({message: "Cliente cadastrado com sucesso!",idCliente });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno", error: error.message });
        }
    },


    atualizaCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nome, cpf, email } = req.body;

            const clienteExistente = await clienteModel.selectById(idCliente);
            if (clienteExistente.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            if (!nome || !cpf || !email) {
                return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
            }

            if (isNaN(Number(cpf)) || String(cpf).length !== 11) {
                return res.status(400).json({ message: 'CPF inválido!' });
            }

            const regexEmail = /\S+@\S+\.\S+/;
            if (!regexEmail.test(email)) {
                return res.status(400).json({ message: 'email inválido!' });
            }

            const emailDuplicado = await clienteModel.selectByEmail(email);
            if (emailDuplicado.length > 0 && emailDuplicado[0].id_cliente != idCliente) {
                return res.status(409).json({ message: 'email já cadastrado!' });
            }

            const resultado = await clienteModel.updateCliente(idCliente, nome, cpf, email);

            return res.status(200).json({
                message: "Cliente atualizado com sucesso!", resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", error: error.message });
        }
    },

    // 
}



module.exports = { clienteController };


