'use strict'

var express = require('express');

var api = express.Router();

var auth = require('../middlewares/autentificacion');

var roles = require('../middlewares/roles');

var directorController = require('../controllers/directorController');


api.get('/get-user-for-formaliza', [auth.ensureAuth, roles.isDirector], directorController.get_user_for_formaliza);
api.get('/get-image-file', directorController.getImageFile);

module.exports = api;