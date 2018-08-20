'use strict'

var express = require('express');

var api = express.Router();

var auth = require('../middlewares/autentificacion');

var roles = require('../middlewares/roles');

var ejecutivoController = require('../controllers/ejecutivoController');

//api.post('/personal', [auth.ensureAuth, roles.isEndUser], usersController.PERSONAL);

api.get('/get-user-for-formaliza', [auth.ensureAuth, roles.isEjecutivo], ejecutivoController.get_user_for_formaliza);
api.get('/get-image-file', ejecutivoController.getImageFile);

module.exports = api;
