const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.post('/pedidos/:idCliente/:idTipoEntrega', pedidoController.criarPedido);
pedidoRoutes.get('/pedidos', pedidoController.consultaPedidos);
pedidoRoutes.get('/pedidos/:idPedido', pedidoController.consultarPedidoPorId);

module.exports = { pedidoRoutes };