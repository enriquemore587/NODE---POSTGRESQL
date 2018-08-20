'use strict'

var express = require('express');

var api = express.Router();

var requestProcess = require('../controllers/requesProcessController');

var auth = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.get('/consult', requestProcess.consult);

module.exports = api;
