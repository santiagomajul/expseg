const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Rutas para expedientes
router.post('/registrar_expediente', controllers.registrarExpediente);
router.get('/buscar_expedientes', controllers.buscarExpedientes);
router.get('/listar_expedientes', controllers.listarExpedientes);
router.get('/detalles_expediente/:id', controllers.detallesExpediente);

// Rutas para movimientos
router.post('/registrar_movimiento', controllers.registrarMovimiento);
router.get('/expediente_existe/:expedienteId', controllers.expedienteExiste);
router.get('/buscar_movimiento', controllers.buscarMovimiento);
router.get('/listar_movimiento', controllers.listarMovimiento);

module.exports = router;