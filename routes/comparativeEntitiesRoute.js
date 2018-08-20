'use strict'

var express = require('express');

var api = express.Router();

var comparativeEntitiesController = require('../controllers/comparativeEntitiesController');

var auth = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.get('/comparative', comparativeEntitiesController.comparative);

module.exports = api;
