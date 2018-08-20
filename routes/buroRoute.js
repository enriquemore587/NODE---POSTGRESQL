'use strict'

var express = require('express');

var api = express.Router();

var buroController =  require('../controllers/buroController');

var autentificacion = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.get('/consult', autentificacion.ensureAuth, buroController.consult);

module.exports =  api;
