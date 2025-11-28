const express = require('express');
const router = express.Router();
const { pedidoRoutes } = require('./pedidoRoutes');
const { pedidoRoutes, clienteRoutes} = require('./clienteRoutes');

router.use('/', pedidoRoutes);
router.use('/', clienteRoutes);

module.exports = { router };