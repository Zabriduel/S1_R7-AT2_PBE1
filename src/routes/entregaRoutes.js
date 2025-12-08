const express = require('express');
const entregaRoutes = express.Router();
const { entregaController } = require('../controllers/entregaController');

entregaRoutes.post('/entregas/:idPedido/:idFuncionario', entregaController.criarEntrega);
entregaRoutes.get('/entregas', entregaController.consultarEntregas);
entregaRoutes.get('/entregas/:idEntrega', entregaController.consultarEntregaPorId);
entregaRoutes.patch('/entregas/:idEntrega', entregaController.alterarEntrega);
entregaRoutes.delete('/entregas/delete/:idEntrega', entregaController.deletarEntrega);

module.exports = { entregaRoutes };
