const { clienteModel } = require('../models/clienteModel');

const DadosCep = async (cep) => {
    try {
        if (!cep || String(cep).length !== 8 || isNaN(Number(cep))) {
            return { erro: true, message: "CEP inválido ou não informado." };
        }
        console.log(cep);
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const json = await response.json();

        if (json.erro) {
            return { erro: true, message: "CEP não encontrado no ViaCEP." };
        }

        return {
            erro: false,
            logradouro: json.logradouro,
            bairro: json.bairro,
            cidade: json.localidade,
            estado: json.uf
        };

    } catch (error) {
        console.error("Erro ViaCEP:", error);
        return { erro: true, message: "Erro ao consultar o ViaCEP." };
    }
};

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
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    incluiRegistro: async (req, res) => {
        try {
            const { nome, cpf, email, numero_telefone, cep, numero_casa, complemento, data_nasc, idade, status_cliente } = req.body;

            if (!nome || !cpf || !email || !numero_telefone || !cep || !numero_casa || !data_nasc || !idade) {
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

            const dadosCep = await DadosCep(cep);
            if (dadosCep.erro) {
                return res.status(400).json({ message: dadosCep.message });
            }


            const status = status_cliente || "ativo";

            const cliente = await clienteModel.insertCliente(nome, cpf, email, data_nasc, idade, status);
            const idCliente = cliente.insertId;

            await clienteModel.insertTelefone(idCliente, numero_telefone);

            await clienteModel.insertEndereco(
                idCliente,
                dadosCep.logradouro,
                numero_casa,
                dadosCep.bairro,
                dadosCep.cidade,
                dadosCep.estado,
                cep,
                complemento
            );

            return res.status(201).json({ message: "Cliente cadastrado com sucesso!", idCliente });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno", error: error.message });
        }
    },

    incluiEndereco: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { cep, numero_casa, complemento } = req.body;

            if (!cep || !numero_casa) {
                return res.status(400).json({ message: "CEP e número da casa são obrigatórios!" });
            }

            const cliente = await clienteModel.selectById(idCliente);
            if (cliente.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado!" });
            }

            const dadosCep = await DadosCep(cep);
            if (dadosCep.erro) {
                return res.status(400).json({ message: dadosCep.message });
            }

            const resultado = await clienteModel.insertEndereco(
                idCliente,
                dadosCep.logradouro,
                numero_casa,
                dadosCep.bairro,
                dadosCep.cidade,
                dadosCep.estado,
                cep,
                complemento || ""
            );

            return res.status(201).json({ message: "Endereço adicionado com sucesso!", idEndereco: resultado.insertId });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", error: error.message });
        }
    },



    incluiTelefone: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { numero_telefone } = req.body;

            if (!numero_telefone) {
                return res.status(400).json({ message: "Número de telefone é obrigatório!" });
            }

            const cliente = await clienteModel.selectById(idCliente);
            if (cliente.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado!" });
            }

            const resultado = await clienteModel.insertTelefone(idCliente, numero_telefone);

            return res.status(201).json({ message: "Telefone adicionado com sucesso!", idTelefone: resultado.insertId });

        } catch (error) {
            console.error(error); res.status(500).json({ message: "Erro ao adicionar telefone", error: error.message });
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

    atualizaStatus: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { status_cliente } = req.body;

            if (!["ativo", "inativo"].includes(status_cliente)) {
                return res.status(400).json({ message: "Status inválido! Use 'ativo' ou 'inativo'." });
            }

            const cliente = await clienteModel.selectById(idCliente);
            if (cliente.length === 0)
                return res.status(404).json({ message: "Cliente não encontrado" });

            const resultado = await clienteModel.updateStatus(idCliente, status_cliente);

            return res.status(200).json({
                message: "Status atualizado com sucesso!",
                resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", error: error.message });
        }
    },


    atualizaTelefone: async (req, res) => {
        try {
            const { idTelefone } = req.params;
            const { numero_telefone } = req.body;

            if (!numero_telefone) {
                return res.status(400).json({ message: "Número de telefone é obrigatório" });
            }
            const numeroExistente = await clienteModel.selectTelefoneById(idTelefone);
            if (numeroExistente.length === 0) {
                return res.status(404).json({ message: "Telefone não encontrado!" });
            }

            const resultado = await clienteModel.updateTelefone(idTelefone, numero_telefone);

            res.status(200).json({ message: "Telefone atualizado com sucesso", resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao atualizar telefone", error: error.message });
        }
    },
    atualizaEndereco: async (req, res) => {
        try {
            const idEndereco = Number(req.params.idEndereco);
            const { cep, numero_casa, complemento } = req.body;
            console.log(idEndereco);

            const enderecoExistente = await clienteModel.selectEnderecoById(idEndereco);
            console.log(enderecoExistente);
            if (enderecoExistente.length === 0) {
                return res.status(404).json({ message: "Endereço não encontrado!" });
            }

            const dadosCep = await DadosCep(cep);

            if (dadosCep.erro) {
                return res.status(400).json({ message: dadosCep.message });
            }

            const enderecoAtualizado = {
                cep,
                logradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                cidade: dadosCep.cidade,
                estado: dadosCep.estado,
                numero: numero_casa,
                complemento: complemento || ""
            };

            await clienteModel.updateEndereco(idEndereco, enderecoAtualizado);

            return res.status(200).json({
                message: "Endereço atualizado com sucesso!",
                endereco: enderecoAtualizado
            });

        } catch (error) {
            console.error("Erro no update de endereço:", error);
            return res.status(500).json({ message: "Erro no servidor" });
        }
    },

    excluiCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const cliente = await clienteModel.selectById(idCliente);

            if (cliente.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado!!" });
            }

            const pedidos = await clienteModel.selectPedidosByCliente(idCliente);
            if (pedidos.length > 0) {
                return res.status(400).json({ message: "Não é possível excluir, o cliente ja possui pedidos registrados!" });
            }

            await clienteModel.deleteTelefone(idCliente);
            await clienteModel.deleteEnderecos(idCliente);
            await clienteModel.deleteCliente(idCliente);

            return res.status(200).json({ message: "Cliente excluído com sucesso!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao excluir cliente", error: error.message });
        }
    },



}


module.exports = { clienteController };


