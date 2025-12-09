const { clienteModel } = require('../models/clienteModel');
const { funcoesUteis } = require('../utils/utils');

const clienteController = {

    /**
     * Função para listar todos os clientes ou um cliente específico por ID na rota GET /clientes
     * @async
     * @function selecionaTodos
     * @param {Object} req Objeto da requisição HTTP (query opcional: idCliente)
     * @param {Object} res Objeto de resposta HTTP
     * @returns {Promise<Array<Object>>} Lista de clientes, um cliente específico ou mensagem de aviso
     * 
     * @example
     * // GET /clientes
     * {
     *   "data": [
     *     {
     *       "id_cliente": 1,
     *       "nome_cliente": "João"
     *     }
     *   ]
     * }
     * 
     * // GET /clientes?idCliente=2
     * {
     *   "data": {
     *     "id_cliente": 2,
     *     "nome_cliente": "Maria"
     *   }
     * }
     */
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

    /**
     * Função para buscar um cliente pelo ID na rota GET /clientes/:idCliente
     * @async
     * @function selecionarClientePorId
     * @param {Object} req Objeto da requisição HTTP (params: idCliente)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Array<Object>>} Dados do cliente ou mensagem de erro
     * 
     * @example
     * // GET /clientes/5
     * {
     *   "message": "Cliente encontrado com sucesso.",
     *   "dados": {
     *     "id_cliente": 5,
     *     "nome_cliente": "João"
     *   }
     * }
     */
    selecionarClientePorId: async (req, res) => {
        try {
            const { idCliente } = req.params;
            if (!idCliente) {
                return res.status(400).json({ message: "Informe o ID do cliente." });
            }
            const resultado = await clienteModel.selectClientesPorId(idCliente);
            if (resultado.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }
            return res.status(200).json({ message: "Cliente encontrado com sucesso.", dados: resultado[0] });
        } catch (error) {
            console.error("Erro ao buscar cliente por ID:", error);
            return res.status(500).json({ message: "Erro interno ao buscar o cliente.", error: error.message });
        }
    },


    /**
     * Função para buscar um cliente pelo CPF na rota GET /clientes/cpf/:cpf
     * @async
     * @function selecionaClientePorCpf
     * @param {Object} req Objeto da requisição HTTP (params: cpf)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Array<Object>>} Dados do cliente encontrado ou mensagem de erro
     * 
     * @example
     * // GET /clientes/cpf/12436476554
     * {
     *   "message": "Cliente encontrado com sucesso.",
     *   "dados": {
     *     "id_cliente": 3,
     *     "nome": "Juliana",
     *     "cpf": "12436476554",
     *     "email": "juliana@gmail.com",
     *     "data_cadastro": "2025-12-02T14:05:51.000Z",
     *     "data_nascimento": "1992-10-25T03:00:00.000Z",
     *     "status_cliente": "ativo"
     *   }
     * }
     */
    selecionaClientePorCpf: async (req, res) => {
        try {
            const { cpf } = req.params;

            const cliente = await clienteModel.selectByCpf(cpf);

            if (cliente.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            return res.status(200).json(cliente);

        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar cliente por CPF", error: error.message });
        }
    },


    /**
  * Controlador para buscar um cliente pelo E-mail na rota GET /clientes/email/:email
  * @async
  * @function selectByEmail
  * @param {Request} req Objeto da requisição HTTP
  * @param {Response} res Objeto da resposta HTTP
  * @returns {Promise<Array<Object>>} Retorna os dados do cliente ou mensagem caso não exista
  */
    selectByEmail: async (req, res) => {
        try {
            const { email } = req.params;

            const result = await clienteModel.selectByEmail(email);

            if (result.length === 0) {
                return res.status(404).json({ message: "Nenhum cliente encontrado com este e-mail." });
            }

            return res.status(200).json({ message: "Cliente encontrado.", dados: result[0] });

        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar por e-mail", error: error.message });
        }
    },

    /**
       * Função para buscar um telefone pelo ID na rota GET /telefones/:idTelefone
       * @async
       * @function selectTelefoneById
       * @param {Request} req Objeto da requisição HTTP
       * @param {Response} res Objeto da resposta HTTP
       * @returns {JSON} Retorna os dados do telefone encontrado ou mensagem de erro
       */
    selectTelefoneById: async (req, res) => {
        try {
            const { idTelefone } = req.params;

            if (!idTelefone) {
                return res.status(400).json({ message: "É necessário informar o ID do telefone." });
            }

            const telefone = await clienteModel.selectTelefoneById(idTelefone);

            if (telefone.length === 0) {
                return res.status(404).json({ message: "Telefone não encontrado." });
            }

            return res.status(200).json(telefone);

        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar telefone.", error: error.message
            });
        }
    },


    /**
     * Função para cadastrar um novo cliente com telefone e endereço na rota POST /clientes
     * @async
     * @function incluiRegistro
     * @param {Object} req Objeto da requisição HTTP contendo os dados do cliente no body
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com o ID do cliente cadastrado ou mensagem de erro
     * 
     * @example
     * // POST /clientes
     * {
     *   "nome": "Maria Silva",
     *   "cpf": "12345678901",
     *   "email": "maria@email.com",
     *   "numero_telefone": "11999999999",
     *   "cep": "01001000",
     *   "numero_casa": "123",
     *   "complemento": "Apto 45",
     *   "data_nasc": "2000-05-10",
     *   "idade": 24,
     *   "status_cliente": "ativo"
     * }
     */
    incluiRegistro: async (req, res) => {
        try {
            const { nome, cpf, email, numero_telefone, cep, numero_casa, complemento, data_nasc, idade, status_cliente } = req.body;

            if (!nome || !cpf || !email || !numero_telefone || !cep || !numero_casa || !data_nasc || !idade) {
                return res.status(400).json({ message: 'Preencha todos os dados obrigatórios!' });
            }

            if (isNaN(Number(idade)) || idade < 18) {
                return res.status(400).json({ message: "Idade inválida!" });
            }

            if (String(cpf).length !== 11 || isNaN(Number(cpf))) {
                return res.status(400).json({ message: 'CPF inválido!' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'email inválido!' });
            }
            const dadosCep = await funcoesUteis.dadosCep(cep);

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

    /**
     * Função para cadastrar um endereço para um cliente na rota POST /clientes/:idCliente/enderecos
     * @async
     * @function incluiEndereco
     * @param {Object} req Objeto da requisição HTTP (params: idCliente, body: cep, numero_casa, complemento)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com o ID do endereço ou mensagem de erro
     * 
     * @example
     * // POST /clientes/10/endereco
     * {
     *   "cep": "01001000",
     *   "numero_casa": "123",
     *   "complemento": "Apto 45"
     * }
     */
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

            const dadosCep = await funcoesUteis.dadosCep(cep);
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

    /**
     * Função para cadastrar um telefone para um cliente na rota POST /clientes/:idCliente/telefones
     * @async
     * @function incluiTelefone
     * @param {Object} req Objeto da requisição HTTP (params: idCliente, body: numero_telefone)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com o ID do telefone ou mensagem de erro
     * 
     * @example
     * // POST /clientes/10/telefone
     * {
     *   "numero_telefone": "11999999999"
     * }
     */
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

    /**
     * Função para atualizar os dados de um cliente na rota PUT /clientes/:idCliente
     * @async
     * @function atualizaCliente
     * @param {Object} req Objeto da requisição HTTP (params: idCliente, body: nome, cpf, email)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com os dados atualizados ou mensagem de erro
     * 
     * @example
     * // PUT /clientes/5
     * {
     *   "nome": "João da Silva",
     *   "cpf": "12345678901",
     *   "email": "joao@email.com"
     * }
     */
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

            return res.status(200).json({message: "Cliente atualizado com sucesso!", resultado});

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", error: error.message });
        }
    },

    /**
     * Função para atualizar o status de um cliente (ativo ou inativo) na rota PATCH /clientes/:idCliente/status
     * @async
     * @function atualizaStatus
     * @param {Object} req Objeto da requisição HTTP (params: idCliente, body: status_cliente)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com a confirmação da atualização ou mensagem de erro
     * 
     * @example
     * // PATCH /clientes/5/status
     * {
     *   "status_cliente": "inativo"
     * }
     */
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

            return res.status(200).json({message: "Status atualizado com sucesso!",resultado});

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", error: error.message });
        }
    },
    /**
     * Função para atualizar o número de telefone de um cliente na rota PUT /telefones/:idTelefone
     * @async
     * @function atualizaTelefone
     * @param {Object} req Objeto da requisição HTTP (params: idTelefone, body: numero_telefone)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com a confirmação da atualização ou mensagem de erro
     * 
     * @example
     * // PATCH /telefones/8
     * {
     *   "numero_telefone": "11988887777"
     * }
     * 
     */
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

    /**
     * Função para atualizar o endereço de um cliente naa rota PUT /clientes/enderecos/:idEndereco
     * @async
     * @function atualizaEndereco
     * @param {Object} req Objeto da requisição HTTP (params: idEndereco, body: cep, numero_casa, complemento)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso com os dados do endereço atualizado ou mensagem de erro
     * 
     * @example
     * // PUT /enderecos/5
     * {
     *   "cep": "01001000",
     *   "numero_casa": "123",
     *   "complemento": "Apto 45"
     * }
     */

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

            const dadosCep = await funcoesUteis.dadosCep(cep);

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

            return res.status(200).json({ message: "Endereço atualizado com sucesso!", endereco: enderecoAtualizado });

        } catch (error) {
            console.error("Erro no update de endereço:", error);
            return res.status(500).json({ message: "Erro no servidor" });
        }
    },

    /**
     * Função para excluir um cliente pelo ID na rota DELETE /clientes/:idCliente
     * @async
     * @function excluiCliente
     * @param {Object} req Objeto da requisição HTTP (params: idCliente)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso confirmando a exclusão ou mensagem de erro
     * 
     * @example
     * // DELETE /clientes/5
     * 
     * // Resposta de sucesso:
     * {
     *   "message": "Cliente excluído com sucesso!"
     * }
     * // Erros:
     * {"message": "Cliente não encontrado!"}
     * {"message": "Não é possível excluir: cliente possui pedidos registrados."}
     */

    excluiCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            const cliente = await clienteModel.selectById(idCliente);
            if (cliente.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado!" });
            }

            const pedidos = await clienteModel.selectPedidosByCliente(idCliente);
            if (pedidos.length > 0) {
                return res.status(400).json({ message: "Não é possível excluir: cliente possui pedidos registrados." });
            }
            await clienteModel.deleteCliente(idCliente);

            return res.status(200).json({ message: "Cliente excluído com sucesso!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao excluir cliente", error: error.message });
        }
    },

    /**
     * Função para excluir um endereço de um cliente na rota DELETE /enderecos/:idEndereco
     * @async
     * @function excluiEndereco
     * @param {Object} req Objeto da requisição HTTP (params: idEndereco)
     * @param {Object} res Objeto da resposta HTTP
     * @returns {Promise<Object>} Mensagem de sucesso confirmando a exclusão ou mensagem de erro
     * 
     * @example
     * // DELETE /enderecos/5
     * 
     * // Resposta de sucesso:
     * {
     *   "message": "Endereço excluído com sucesso!"
     * }
     * // Erros:
     * {"message": "Endereço não encontrado!"}
     * {"message": "O cliente deve ter pelo menos um endereço cadastrado. Não é possível excluir um único endereço."}
     */

    excluiEndereco: async (req, res) => {
        try {
            const { idEndereco } = req.params;

            const endereco = await clienteModel.selectEnderecoById(idEndereco);
            if (endereco.length === 0) {
                return res.status(404).json({ message: "Endereço não encontrado!" });
            }

            const idCliente = endereco[0].id_cliente;

            const totalEnderecos = await clienteModel.countEnderecos(idCliente);

            if (totalEnderecos <= 1) {
                return res.status(400).json({ message: "O cliente deve ter pelo menos um endereço cadastrado. Não é possível excluir um único endereço." });
            }

            await clienteModel.deleteEnderecoById(idEndereco);

            return res.status(200).json({ message: "Endereço excluído com sucesso!" });

        } catch (error) {
            console.error("Erro ao excluir endereço:", error);
            return res.status(500).json({ message: "Erro interno ao excluir endereço", error: error.message });
        }
    },

    /**
 * Função para excluir um telefone de um cliente na rota DELETE /clientes/telefones/:idTelefone
 * @async
 * @function excluiTelefone
 * @param {Object} req Objeto da requisição HTTP (params: idTelefone)
 * @param {Object} res Objeto da resposta HTTP
 * @returns {Promise<Object>} Mensagem de sucesso confirmando a exclusão ou mensagem de erro
 * 
 * @example
 * // DELETE /telefones/5
 * 
 * // Resposta de sucesso:
 * {"message": "Telefone excluído com sucesso!"}

 * // Erros:
 * {"message": "Telefone não encontrado!"}
 * {"message": "O cliente deve ter pelo menos um telefone cadastrado. Não é possível excluir um único telefone."}
 */

    excluiTelefone: async (req, res) => {
        try {
            const { idTelefone } = req.params;


            const telefone = await clienteModel.selectTelefoneById(idTelefone);
            if (telefone.length === 0) {
                return res.status(404).json({ message: "Telefone não encontrado!" });
            }

            const idCliente = telefone[0].id_cliente;

            const totalTelefones = await clienteModel.countTelefones(idCliente);

            if (totalTelefones <= 1) {
                return res.status(400).json({ message: "O cliente deve ter pelo menos um telefone cadastrado. Não é possível excluir um único telefone." });
            }

            await clienteModel.deleteTelefoneById(idTelefone);

            return res.status(200).json({ message: "Telefone excluído com sucesso!" });

        } catch (error) {
            console.error("Erro ao excluir telefone:", error);
            return res.status(500).json({ message: "Erro interno ao excluir telefone", error: error.message });
        }
    }
}

module.exports = { clienteController };


