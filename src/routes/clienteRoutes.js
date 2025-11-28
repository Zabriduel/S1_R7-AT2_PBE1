const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes', clienteController.selecionaTodos);
clienteRoutes.post('/clientes', clienteController.incluiRegistro);

module.exports = { clienteRoutes };