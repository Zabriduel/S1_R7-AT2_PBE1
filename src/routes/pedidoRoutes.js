const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.post('/pedidos/:idCliente/:idTipoEntrega/', pedidoController.criarPedido);

module.exports = { pedidoRoutes };