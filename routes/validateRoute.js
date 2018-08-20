'use strict'

var express = require('express');

var api = express.Router();


var validateController = require('../controllers/validateController');

var autentificacion = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.get('/blacklist', autentificacion.ensureAuth , validateController.blacklist);

api.get('/evalcredit',  validateController.evaluateCredit);

module.exports = api;
