'use strict'

var express = require('express');

var api = express.Router();

var imssController = require('../controllers/imssController');

var auth = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.post('/reconocimiento-facial', imssController.COMPARACION_FACIAL);
api.post('/valida-ine', imssController.VALIDACIO_INE_IFE);
api.post('/recibo-nomina', [auth.ensureAuth, rol.isEndUser], imssController.set_imss_deposit);

module.exports = api;
