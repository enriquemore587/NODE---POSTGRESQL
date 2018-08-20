'use strict'

var express  = require('express');

var api = express.Router();

var autentificacion = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

var documentController =  require('../controllers/documentController');


api.post('/addDocument',[autentificacion.ensureAuth, rol.isEndUser],  documentController.addDocument);
api.post('/pdf2jpg',[autentificacion.ensureAuth, rol.isEndUser],  documentController.PdfDocument)

module.exports =  api;
