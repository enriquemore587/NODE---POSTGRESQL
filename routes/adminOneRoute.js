'use strict'

var express = require('express');

var api = express.Router();

var adminController = require('../controllers/adminController');

var auth = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.get('/get-users-list', adminController.get_users_list);
api.get('/get-general-information-user', adminController.get_general_information_user);
api.get('/get-image-file', adminController.getImageFile);
api.get('/get-locations-by-user-success', adminController.get_locations_by_user_success);
api.post('/get-image-file2', adminController.getImageFile2);

module.exports = api;
