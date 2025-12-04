const express = require('express');
const clienteRoutes = express.Router();

const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes', clienteController.selecionaTodos);
clienteRoutes.post('/clientes', clienteController.incluiRegistro);
clienteRoutes.put('/clientes/:idCliente', clienteController.atualizaCliente);
clienteRoutes.put('/telefones/:idTelefone', clienteController.atualizaTelefone);
clienteRoutes.put('/clientes/enderecos/:idEndereco', clienteController.atualizaEndereco);

clienteRoutes.delete('/clientes/:idCliente', clienteController.excluiCliente);

clienteRoutes.post('/clientes/:idCliente/telefones', clienteController.incluiTelefone);
clienteRoutes.post('/clientes/:idCliente/enderecos', clienteController.incluiEndereco);

clienteRoutes.delete('/enderecos/:idEndereco', clienteController.excluiEndereco); 


module.exports = { clienteRoutes };
