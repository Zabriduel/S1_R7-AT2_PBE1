const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.get('/pedidos/:idPedido', pedidoController.consultarPedidoPorId);
pedidoRoutes.get('/pedidos', pedidoController.consultaPedidos);
pedidoRoutes.post('/pedidos/:idCliente/:idEndereco/:idTipoEntrega', pedidoController.criarPedido);
pedidoRoutes.patch('/pedidos/:idPedido/endereco/:idEndereco', pedidoController.alterarPedido);
pedidoRoutes.patch('/pedidos/:idPedido/status/:idStatusEntrega', pedidoController.alterarStatusPedido);
pedidoRoutes.delete('/pedidos/delete/:idPedido', pedidoController.deletarPedido);

module.exports = { pedidoRoutes };