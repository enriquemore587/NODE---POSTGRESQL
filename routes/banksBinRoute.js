'use strict'

var express = require('express');

var api = express.Router();

var banksBinController =  require('../controllers/banksBinController');

var auth = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.get('/validate', auth.ensureAuth,  banksBinController.validate_bin);

api.get('/validate/clabe', auth.ensureAuth, banksBinController.validate_clabe);

module.exports =  api;
