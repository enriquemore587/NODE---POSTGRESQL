'use strict'

var express = require('express');

var api = express.Router();

var auth = require('../middlewares/autentificacion');

var roles = require('../middlewares/roles');

var usersController = require('../controllers/usersController');

api.post('/personal', [auth.ensureAuth, roles.isEndUser], usersController.PERSONAL);
api.post('/address', [auth.ensureAuth, roles.isEndUser], usersController.ADDRESS);

api.post('/referencias', [auth.ensureAuth, roles.isEndUser], usersController.REFERENCIAS);
api.get('/referencias', [auth.ensureAuth, roles.isEndUser], usersController.GET_REFERENCIAS);


api.post('/ingresos', [auth.ensureAuth, roles.isEndUser], usersController.save_update_user_payroll_receipt);

api.get('/addressByCP', [auth.ensureAuth, roles.isEndUser], usersController.ADDRESS_BY_CP);
api.get('/catalogos', usersController.GET_CATALOGOS);
api.get('/personal', [auth.ensureAuth, roles.isEndUser], usersController.GET_PERSONAL);
api.get('/address', [auth.ensureAuth, roles.isEndUser], usersController.GET_ADDRESS);


api.post('/user_request_credit', [auth.ensureAuth, roles.isEndUser], usersController.set_user_credit_request);
api.get('/get-icc-bank-motor', [auth.ensureAuth, roles.isEndUser], usersController.get_icc_bank_motor);

api.get('/all_user', auth.ensureAuth, usersController.get_all_user);

api.get('/userDataAll', auth.ensureAuth,usersController.get_user_data_all );

// linea enrique
api.get('/get-user-for-test', [auth.ensureAuth, roles.isBankUser],usersController.get_user_for_test);

module.exports = api;
