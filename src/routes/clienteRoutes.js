const express = require('express');
const clienteRoutes = express.Router();

const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes', clienteController.selecionaTodos);
clienteRoutes.get('/clientes/:idCliente', clienteController.selecionarClientePorId);
clienteRoutes.get('/clientes/cpf/:cpf', clienteController.selecionaClientePorCpf);
clienteRoutes.get('/clientes/email/:email', clienteController.selectByEmail);
clienteRoutes.get('/telefones/:idTelefone', clienteController.selectTelefoneById);

clienteRoutes.post('/clientes', clienteController.incluiRegistro);
clienteRoutes.post('/clientes/:idCliente/telefones', clienteController.incluiTelefone);
clienteRoutes.post('/clientes/:idCliente/enderecos', clienteController.incluiEndereco);

clienteRoutes.put('/clientes/:idCliente', clienteController.atualizaCliente);
clienteRoutes.put('/telefones/:idTelefone', clienteController.atualizaTelefone);
clienteRoutes.put('/clientes/enderecos/:idEndereco', clienteController.atualizaEndereco);
clienteRoutes.put('/status/:idCliente', clienteController.atualizaStatus);

clienteRoutes.delete('/clientes/:idCliente', clienteController.excluiCliente);
clienteRoutes.delete('/telefones/:idTelefone', clienteController.excluiTelefone);
clienteRoutes.delete('/enderecos/:idEndereco', clienteController.excluiEndereco);



module.exports = { clienteRoutes };
