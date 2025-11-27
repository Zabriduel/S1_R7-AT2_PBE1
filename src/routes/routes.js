const express = require('express');
const router = express.Router();
const { pedidoRoutes } = require('./pedidoRoutes');

router.use('/', pedidoRoutes);

module.exports = { router };