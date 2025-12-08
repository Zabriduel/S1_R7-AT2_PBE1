const express = require('express');
const router = express.Router();
const { pedidoRoutes } = require('./pedidoRoutes');
const { clienteRoutes } = require('./clienteRoutes');
const { entregaRoutes } = require('./entregaRoutes');

router.use('/', pedidoRoutes);
router.use('/', entregaRoutes);
router.use('/', clienteRoutes);

module.exports = { router };