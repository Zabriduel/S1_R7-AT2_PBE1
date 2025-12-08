const { pool } = require('../config/db');

const clienteModel = {

    /**
     * Função para buscar todos os clientes na rota GET /clientes
     * @async
     * @function selectAll
     * @returns {Array<Array<Object>>} Retorna uma lista com todos os clientes cadastrados
     * 
     * @example
     * {
     *   "message": "Lista de clientes retornada com sucesso.",
     *   "dados": [
     *     {
     *       "id_cliente": 1,
     *       "nome": "Juliana",
     *       "cpf": "12436476554",
     *       "email": "juliana@gmail.com",
     *       "data_cadastro": "2025-12-02T14:05:51.000Z",
     *       "data_nascimento": "1992-10-25T03:00:00.000Z",
     *       "status_cliente": "ativo"
     *     },
     *     {
     *       "id_cliente": 2,
     *       "nome": "Carlos",
     *       "cpf": "98765432100",
     *       "email": "carlos@gmail.com",
     *       "data_cadastro": "2025-11-15T10:22:10.000Z",
     *       "data_nascimento": "1988-07-12T03:00:00.000Z",
     *       "status_cliente": "inativo"
     *     }
     *   ]
     * }
     */

    selectAll: async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
  * Função para buscar um cliente completo pela VIEW na rota GET /clientes/:idCliente
  * @async
  * @function selectClientesPorId
  * @param {number} pIdCliente ID do cliente
  * @returns {Promise<Array<Object>>} Retorna os dados do cliente
  * 
  * @example
  * {
    "message": "Cliente encontrado com sucesso.",
    "dados": {
        "ID_Cliente": 3,
        "Nome": "Juliana",
        "CPF": "12436476554",
        "Email": "juliana@gmail.com",
        "Data_Cadastro": "2025-12-02T14:05:51.000Z",
        "Data_Nascimento": "1992-10-25T03:00:00.000Z",
        "Idade": 33,
        "status_cliente": "ativo",
        "Telefones": "13686641586, 19686541586",
        "Enderecos": [
            {
                "cep": "13181373",
                "bairro": "Residencial Sao Jose",
                "cidade": "Sumaré",
                "estado": "SP",
                "numero": "280",
                "logradouro": "Rua José",
                "complemento": "Casa"
            },
  */
    selectClientesPorId: async (pIdCliente) => {
        const sql = 'SELECT * FROM view_dados_clientes WHERE ID_Cliente=?';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Função para buscar um cliente pelo ID na rota GET /clientes/:idCliente
     * @async
     * @function selectById
     * @param {number} pIdCliente ID do cliente
     * @returns {Promise<Array<Object>>} Retorna os dados do cliente encontrado
     * 
     * @example
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

    selectById: async (pIdCliente) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    /**
     * Função para buscar um cliente pelo CPF na rota GET /clientes/cpf/:cpf
     * @async
     * @function selectByCpf
     * @param {number} pCpf CPF do cliente
     * @returns {Array<Object>} Retorna os dados do cliente correspondente ao CPF informado
     * 
     * @example
     * {
     *   "message": "Cliente encontrado com sucesso.",
     *   "dados": {
     *     "id_cliente": 5,
     *     "nome": "Juliana",
     *     "cpf": "12436476554",
     *     "email": "juliana@gmail.com",
     *     "data_cadastro": "2025-12-02T14:05:51.000Z",
     *     "data_nascimento": "1992-10-25T03:00:00.000Z",
     *     "status_cliente": "ativo"
     *   }
     * }
     */

    selectByCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?';
        const values = [pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Função para buscar um cliente pelo E-mail na rota GET /clientes/email/:email
     * @async
     * @function selectByEmail
     * @param {string} pEmail E-mail do cliente
     * @returns {Promise<Array<Object>>} Retorna os dados do cliente correspondente ao e-mail informado
     * 
     * @example
     * {
     *   "message": "Cliente encontrado com sucesso.",
     *   "dados": {
     *     "id_cliente": 5,
     *     "nome": "Juliana",
     *     "cpf": "12436476554",
     *     "email": "juliana@gmail.com",
     *     "data_cadastro": "2025-12-02T14:05:51.000Z",
     *     "data_nascimento": "1992-10-25T03:00:00.000Z",
     *     "status_cliente": "ativo"
     *   }
     * }
     */

    selectByEmail: async (pEmail) => {
        const sql = 'SELECT * FROM clientes WHERE email = ?';
        const values = [pEmail];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Função para buscar um telefone pelo ID na rota GET /telefones/:idTelefone
     * @async
     * @function selectTelefoneById
     * @param {number} pIdTelefone ID do telefone
     * @returns {Array<Object>} Retorna os dados do telefone correspondente ao ID informado
     * 
     * @example
     * {
     *   "message": "Telefone encontrado com sucesso.",
     *   "dados": {
     *     "id_telefone": 12,
     *     "id_cliente": 5,
     *     "tipo": "celular",
     *     "numero": "11987654321"
     *   }
     * }
     */

    selectTelefoneById: async (pIdTelefone) => {
        const sql = 'SELECT * FROM telefones WHERE id_telefone = ?';
        const values = [pIdTelefone];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
   * Função para buscar endereço do cliente pelo ID
   * @async
   * @function selectEnderecoById
   * @param {number} idEndereco ID do endereço
   * @returns {Array<Object>} Retorna o endereço encontrado
   */
    selectEnderecoById: async (idEndereco) => {
        const sql = 'SELECT * FROM enderecos WHERE id_endereco = ?;';
        const values = [idEndereco];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    /**
     * Função para buscar pedidos de um cliente na tabela pedidos
     * @async
     * @function selectPedidosByCliente
     * @param {number} idCliente ID do cliente
     * @returns {Array<Object>} Retorna os pedidos do cliente
     */
    selectPedidosByCliente: async (idCliente) => {
        const sql = 'SELECT * FROM pedidos WHERE id_cliente = ?;';
        const values = [idCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

        /**
     * Função para inserir um novo cliente no banco de dados na rota POST /clientes
     * A operação é realizada dentro de uma transação.
     *
     * @async
     * @function insertCliente
     * @param {string} pNome Nome completo do cliente
     * @param {number} pCpf CPF do cliente (único)
     * @param {string} pEmail E-mail do cliente
     * @param {string} pData_nasc Data de nascimento do cliente (YYYY-MM-DD)
     * @param {number} pIdade Idade do cliente
     * @param {string} [pStatus="ativo"] Status inicial do cliente (padrão: "ativo")
     *
     * @returns {Object} Retorna o resultado da operação de inserção, incluindo o ID gerado
     *
     * @example
     * // Exemplo de retorno bem-sucedido
     * {
     *   "message": "Cliente inserido com sucesso.",
     *   "insertId": 45,
     *   "affectedRows": 1
     * }
     *
     * @throws {Error} Lança um erro caso a operação falhe, executando rollback da transação
     */
    insertCliente: async (pNome, pCpf, pEmail, pData_nasc, pIdade, pStatus = "ativo") => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO clientes (nome_cliente, cpf, email, data_nasc, idade, status_cliente) VALUES (?, ?, ?, ?, ?, ?);';
            const values = [pNome, pCpf, pEmail, pData_nasc, pIdade, pStatus];
            const [rows] = await connection.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    /**
    * Função para inserir um novo telefone para um cliente na rota POST /telefones
    * A operação é executada dentro de uma transação.
    *
    * @async
    * @function insertTelefone
    * @param {number} pIdCliente ID do cliente ao qual o telefone será vinculado
    * @param {number} pNumeroTelefone Número do telefone a ser cadastrado
    *
    * @returns {Object} Retorna o resultado da operação de inserção, incluindo o ID do telefone criado
    *
    * @example
    * // Retorno esperado em caso de sucesso
    * {
    *   "message": "Telefone inserido com sucesso.",
    *   "insertId": 18
    * }
    *
    * @throws {Error} Retorna um erro caso a transação falhe, executando rollback automaticamente
    */
    insertTelefone: async (pIdCliente, pNumeroTelefone) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO telefones (id_cliente, numero_telefone) VALUES (?, ?)';
            const values = [pIdCliente, pNumeroTelefone];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    /**
      * Função para inserir um novo endereço vinculado a um cliente na rota POST /enderecos
      * A operação é executada dentro de uma transação.
      *
      * @async
      * @function insertEndereco
      * @param {number} pIdCliente ID do cliente ao qual o endereço será associado
      * @param {string} pLogradouro Nome da rua, avenida ou via
      * @param {number} pNumeroCasa Número do imóvel
      * @param {string} pBairro Bairro do endereço
      * @param {string} pCidade Cidade do endereço
      * @param {string} pEstado Estado (UF) do endereço
      * @param {number} pCep CEP do endereço
      * @param {string} pComplemento Informações adicionais (opcional)
      *
      * @returns {Object} Retorna o resultado da operação de inserção, incluindo o ID gerado
      *
      * @example
      * {
      *      "message": "Endereço adicionado com sucesso!",
      *     "idEndereco": 9
      * }
      *
      * @throws {Error} Lança erro caso ocorra falha na inserção, executando rollback automaticamente
      */
    insertEndereco: async (pIdCliente, pLogradouro, pNumeroCasa, pBairro, pCidade, pEstado, pCep, pComplemento) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO enderecos (id_cliente, logradouro, numero_casa, bairro, cidade, estado, cep, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [pIdCliente, pLogradouro, pNumeroCasa, pBairro, pCidade, pEstado, pCep, pComplemento];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

        /**
     * Função para atualizar os dados de um cliente na rota PUT /clientes/:idCliente
     * A operação é executada dentro de uma transação.
     *
     * @async
     * @function updateCliente
     * @param {number} pIdCliente ID do cliente que será atualizado
     * @param {string} pNome Novo nome do cliente
     * @param {number} pCpf Novo CPF do cliente
     * @param {string} pEmail Novo e-mail do cliente
     *
     * @returns {Object} Retorna os dados da operação, incluindo quantidade de linhas afetadas
     *
     * @example
     * {
     *   "message": "Cliente atualizado com sucesso.",
     *   "affectedRows": 1,
     *   "changedRows": 1
     * }
     *
     * @throws {Error} Retorna um erro caso a atualização falhe, executando rollback automaticamente
     */
    updateCliente: async (pIdCliente, pNome, pCpf, pEmail) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'UPDATE clientes SET nome_cliente = ?, cpf = ?, email = ? WHERE id_cliente = ?;';
            const values = [pNome, pCpf, pEmail, pIdCliente];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

        /**
     * Função para atualizar o número de um telefone específico na rota PUT /telefones/:idTelefone
     * A operação é executada dentro de uma transação.
     *
     * @async
     * @function updateTelefone
     * @param {number} pIdTelefone ID do telefone que será atualizado
     * @param {number} pNumeroTelefone Novo número de telefone a ser registrado
     *
     * @returns {Object} Retorna informações da operação
     *
     * @example
     * {
     *   "message": "Telefone atualizado com sucesso.",
     * }
     *
     * @throws {Error} Lança erro caso a atualização falhe, executando rollback automaticamente
     */
    updateTelefone: async (pIdTelefone, pNumeroTelefone) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'UPDATE telefones SET numero_telefone = ? WHERE id_telefone = ?;';
            const values = [pNumeroTelefone, pIdTelefone];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

    /**
     * Função para atualizar os dados de um endereço específico na rota PUT /enderecos/:idEndereco
     * Os campos são recebidos em um objeto
     * A operação ocorre dentro de uma transação.
     *
     * @async
     * @function updateEndereco
     * @param {number} idEndereco ID do endereço a ser atualizado
     * @param {Object} dados Objeto contendo os novos dados do endereço
     * @param {number} dados.cep CEP do endereço
     * @param {string} dados.logradouro Nome da rua, avenida ou via
     * @param {string} dados.bairro Bairro do endereço
     * @param {string} dados.cidade Cidade do endereço
     * @param {string} dados.estado Estado (UF) do endereço
     * @param {string} dados.complemento Informações adicionais (opcional)
     * @param {number} dados.numero Número do imóvel
     *
     * @returns {Object} Retorna informações da operação
     *
     * @example
     * {
     *   "message": "Endereço atualizado com sucesso.",
     * }
     *
     * @throws {Error} Lança erro caso a atualização falhe, executando rollback automaticamente
     */
    updateEndereco: async (idEndereco, dados) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = `
            UPDATE enderecos 
            SET cep = ?, logradouro = ?, bairro = ?, cidade = ?, estado = ?, complemento = ?, numero_casa = ?
            WHERE id_endereco = ?;
        `;

            const values = [
                dados.cep,
                dados.logradouro,
                dados.bairro,
                dados.cidade,
                dados.estado,
                dados.complemento,
                dados.numero,
                idEndereco
            ];

            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

    /**
   * Função para atualizar o status de um cliente na rota PATCH /clientes/:idCliente/status
   * A operação é executada dentro de uma transação.     *
   * @async
   * @function updateStatus
   * @param {number} idCliente ID do cliente que terá o status atualizado
   * @param {string} novoStatus Novo status do cliente ("ativo" ou "inativo")
   * @returns {Object} Retorna informações da operação
   * @example
   * {
   *   "message": "Status do cliente atualizado com sucesso.",
   * }
   *
   * @throws {Error} Lança erro caso a atualização falhe, executando rollback automaticamente
   */
    updateStatus: async (idCliente, novoStatus) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'UPDATE clientes SET status_cliente = ? WHERE id_cliente = ?;';
            const values = [novoStatus, idCliente];
            const [result] = await pool.query(sql, values);
            connection.commit();
            return result;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },
    /**
     * Função para deletar um cliente pelo ID na rota DELETE /clientes/:idCliente
     * @async
     * @function deleteCliente
     * @param {number} idCliente Recebe o valor único do cliente a ser removido
     * @returns {Object} Retorna o resultado da exclusão contendo informações da query
     * 
     * @example
     * const resultado = await clienteModel.deleteCliente(10);
     * 
     * // resposta:
     * {
     *   "fieldCount": 0,
     *   "affectedRows": 1,
     *   "insertId": 0,
     *   "info": "",
     *   "serverStatus": 2,
     *   "warningStatus": 0
     * }
     * 
     * // Observação:
     * // A trigger trg_before_delete_clientes será executada automaticamente.
     */
    deleteCliente: async (idCliente) => {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?;";
        const values = [idCliente]
        const [result] = await pool.query(sql, values);
        // Aciona a TRIGGER: trg_before_delete_clientes;
        return result;
    },
    /**
     * Função para contar quantos endereços um cliente possui.
     * Utilizada em regras de negócio que impedem exclusão do último endereço.
     * @async
     * @function countEnderecos
     * @param {number} idCliente ID do cliente
     * @returns {number} Quantidade total de endereços cadastrados para o cliente

     */
    countEnderecos: async (idCliente) => {
        const sql = "SELECT COUNT(*) AS total FROM enderecos WHERE id_cliente = ?";
        const values = [idCliente];
        const [rows] = await pool.query(sql, values);
        return rows[0].total;
    },

    /**
    * Função para excluir um endereço específico pelo seu ID.
    * Utilizada na rota DELETE /enderecos/:idEndereco
    * @async
    * @function deleteEnderecoById
    * @param {number} idEndereco ID do endereço a ser deletado
    *
    * @returns {Object} Resultado da operação
    * @example
    * {
    *   "message": "Endereço removido com sucesso.",
    * }
    */
    deleteEnderecoById: async (idEndereco) => {
        const sql = "DELETE FROM enderecos WHERE id_endereco = ?";
        const values = [idEndereco]
        const [result] = await pool.query(sql, values);
        return result;
    },

    /**
    * Função para contar quantos telefones um cliente possui.     
    * @async
    * @function countTelefones
    * @param {number} idCliente ID do cliente
   */

    countTelefones: async (idCliente) => {
        const sql = 'SELECT COUNT(*) AS total FROM telefones WHERE id_cliente = ?;';
        const values = [idCliente];
        const [rows] = await pool.query(sql, values);
        return rows[0].total;
    },

    /**
     * Função para excluir um telefone específico pelo seu ID.
     * Utilizada na rota DELETE /telefones/:idTelefone
     *
     * @async
     * @function deleteTelefoneById
     * @param {number} idTelefone ID do telefone que será removido
     *
     * @returns {Object} Retorna o resultado da exclusão
     *
     * @example
     * {
     *   "message": "Telefone removido com sucesso.",
     * }
     */
    deleteTelefoneById: async (idTelefone) => {
        const sql = 'DELETE FROM telefones WHERE id_telefone = ?;';
        const values = [idTelefone];
        const [result] = await pool.query(sql, values);
        return result;
    },

}

module.exports = { clienteModel };