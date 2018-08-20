'use strict'

var express = require('express');

var api = express.Router();

var ocrController = require('../controllers/ocrController');

var auth = require('../middlewares/autentificacion');

var roles = require('../middlewares/roles');

var multipart = require('connect-multiparty');

var GENERIC_STORE = multipart({uploadDir: './services/ocr/resource/genericStore'});
var STORE_INE = multipart({uploadDir: './services/ocr/resource/ine'});
var STORE_COMPROBANTE = multipart({uploadDir: './services/ocr/resource/comprobante'});
var STORE_TARJETA = multipart({uploadDir: './services/ocr/resource/tarjetas'});
var STORE_NSS = multipart({uploadDir: './services/ocr/resource/imss'});

api.post('/ine', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.INE_BOT);
api.post('/ine-bot', GENERIC_STORE, ocrController.INE_BOT);

api.post('/back-ine', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.BACK_INE);
api.post('/back-ine-bot', [GENERIC_STORE], ocrController.BACK_INE);

api.post('/comprobante', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.COMPROBANTES);
api.post('/comprobante-bot', [GENERIC_STORE], ocrController.COMPROBANTES);


api.post('/nomina', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.FOLIO_FISCAL);//
api.post('/nomina-bot', [GENERIC_STORE], ocrController.FOLIO_FISCAL);//

/*
api.post('/pasaporte', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.PASAPORTE);//
api.post('/tarjeta', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.TARJECT);//
api.post('/nss', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.NSS);//
api.post('/cartilla', [auth.ensureAuth, roles.isEndUser, GENERIC_STORE], ocrController.CARTILLA);//
*/

/*  estan de mas pero pueden ser utiles en un momento mas adelante !
api.post('/ine-save', [STORE_INE], ocrController.INE_SAVE);
api.post('/comprobante-save', [STORE_COMPROBANTE], ocrController.COMPROBANTES_SAVE);
api.post('/tarjeta-save', [STORE_TARJETA], ocrController.TARJECT_SAVE);
api.post('/nss-save', [STORE_NSS], ocrController.NSS_SAVE);
*/


module.exports = api;
