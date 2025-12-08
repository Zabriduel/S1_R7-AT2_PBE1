const express = require('express');
const entregaRoutes = express.Router();
const { entregaController } = require('../controllers/entregaController');

entregaRoutes.get('/entregas', entregaController.consultarEntregas);
entregaRoutes.get('/entregas/pedido/:idPedido/', entregaController.consultarEntregaPorPedido);
entregaRoutes.get('/entregas/:idEntrega', entregaController.consultarEntregaPorId);
entregaRoutes.post('/entregas', entregaController.criarEntrega);
entregaRoutes.patch('/entregas/:idEntrega', entregaController.alterarEntrega);
entregaRoutes.delete('/entregas/delete/:idEntrega', entregaController.deletarEntrega);

module.exports = { entregaRoutes };
