const express = require('express');
const clienteRoutes = express.Router();

const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes', clienteController.selecionaTodos);
clienteRoutes.post('/clientes', clienteController.incluiRegistro);
clienteRoutes.put('/clientes/:idCliente', clienteController.atualizaCliente);
clienteRoutes.put('/telefones/:idTelefone', clienteController.atualizaTelefone);
clienteRoutes.put("/clientes/enderecos/:idEndereco", clienteController.atualizaEndereco);


module.exports = { clienteRoutes };