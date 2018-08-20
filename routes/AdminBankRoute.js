'use strict'

var express = require('express');

var api = express.Router();

var AdminBankController = require('../controllers/AdminBankController');

var auth = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

// api.get('/get-users-list', AdminBankController.get_users_list);
api.get('/get-a-user-for-admin-bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_a_user_for_admin_bank);
api.get('/get-list-users-for-admin-bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_list_users_for_admin_bank);
api.get('/get-list-users-for-admin-bank-like-email', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_list_users_for_admin_bank_like_email);
api.get('/get-list-users-for-admin-bank-like-num', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_list_users_for_admin_bank_like_num);
api.post('/update-user-data-from-admin', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.update_user_data_from_admin);
api.get('/get-profiles-for-admin-bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_profiles_for_admin_bank);
api.post('/create-user-bank-for-admin-bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.create_user_bank_for_admin_bank);
api.post('/up-down-user-bank-for-admin-bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.up_down_user_bank_for_admin_bank);
api.get('/get-down-reasons-for-admin-bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_down_reasons_for_admin_bank);
api.get('/get-bitacora-usuarios-for-admin_bank', [auth.ensureAuth, rol.isAdminBanco], AdminBankController.get_bitacora_usuarios_for_admin_bank);
module.exports = api;
