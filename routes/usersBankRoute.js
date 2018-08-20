'use strict'

var express = require('express');

var api = express.Router();

var auth = require('../middlewares/autentificacion');
 
var roles = require('../middlewares/roles');

var userBankController = require('../controllers/userBankController');

api.get('/vars-check/indicadores-buro', [auth.ensureAuth, roles.isBankUser], userBankController.GET_VARS_TO_CHECK_INDICADORES);
api.get('/vars-check/perfil-cliente', [auth.ensureAuth, roles.isBankUser], userBankController.GET_VARS_TO_CHECK_PERFIL_CLIENTE);

api.post('/vars-check/perfil-cliente', [auth.ensureAuth, roles.isBankUser], userBankController.GET_VARS_TO_CHECK_PERFIL_CLIENTE);
api.post('/vars-check/indicadores-buro', [auth.ensureAuth, roles.isBankUser], userBankController.SAVE_VARIABLES_TO_CHECK_INDICADORES);

//  primer ventana
api.get('/criterios/indicadores-buro', [auth.ensureAuth, roles.isBankUser], userBankController.get_criterios_indicadores_menu);
api.get('/criterios/icc-bank', [auth.ensureAuth, roles.isBankUser], userBankController.get_icc_bank);
api.get('/criterios/icc-buro', [auth.ensureAuth, roles.isBankUser], userBankController.get_icc_buro);
api.get('/criterios/getHelp_score', [auth.ensureAuth, roles.isBankUser], userBankController.getHelp_score);
api.post('/criterios/indicadores-buro', [auth.ensureAuth, roles.isBankUser], userBankController.set_variables_bank);
api.put('/criterios/change-icc-bank', [auth.ensureAuth, roles.isBankUser], userBankController.change_a_icc_bank);
api.get('/criterios/get-score-bank', [auth.ensureAuth, roles.isBankUser], userBankController.get_score_bank);
api.post('/criterios/set-configuration-score', [auth.ensureAuth, roles.isBankUser], userBankController.set_configuration_score);

api.post('/criterios/set-a-score-bank', [auth.ensureAuth, roles.isBankUser], userBankController.set_a_score_bank);
api.post('/criterios/delete-a-score-bank', [auth.ensureAuth, roles.isBankUser], userBankController.delete_a_score_bank);

// segunda ventana
api.get('/criterios/perfil-cliente', [auth.ensureAuth, roles.isBankUser], userBankController.get_criterios_cliente_menu);
api.get('/criterios/get-ocupation', [auth.ensureAuth, roles.isBankUser], userBankController.get_ocupation);
api.get('/criterios/get-nationalities', [auth.ensureAuth, roles.isBankUser], userBankController.get_nationalities);
api.put('/criterios/set-a-check-ocupations', [auth.ensureAuth, roles.isBankUser], userBankController.set_a_check_ocupations);
api.put('/criterios/set-a-check-nationalites', [auth.ensureAuth, roles.isBankUser], userBankController.set_a_check_nationalites);

//  calculadora
api.get('/formulas/get-all-vars-banco', [auth.ensureAuth, roles.isBankUser], userBankController.get_all_vars_banco);
api.post('/formulas/set-a-bank-custom-variable', [auth.ensureAuth, roles.isBankUser], userBankController.set_a_bank_custom_variable);
api.get('/formulas/get-a-bank-custom-variable', [auth.ensureAuth, roles.isBankUser], userBankController.get_bak_custom_variables);
api.post('/formulas/set-list-bank-custom-variables', [auth.ensureAuth, roles.isBankUser], userBankController.set_list_bank_custom_variables);
api.delete('/formulas/delete-a-custom-variable/:id', [auth.ensureAuth, roles.isBankUser], userBankController.delete_a_custom_variable);
api.post('/formulas/set-variables-will-be-output', [auth.ensureAuth, roles.isBankUser], userBankController.set_variables_will_be_output);


api.get('/formulas/get-bank-follow-variables-by-bank', [auth.ensureAuth, roles.isBankUser], userBankController.get_bank_follow_variables_by_bank);

// arbol
api.get('/formulas/get-order-default-variables-by-bank', [auth.ensureAuth, roles.isBankUser], userBankController.get_order_default_variables_by_bank);

api.get('/pruebas/get-list-to-validation', [auth.ensureAuth, roles.isBankUser], userBankController.get_list_to_validation);
api.post('/pruebas/validate-range', [auth.ensureAuth, roles.isBankUser], userBankController.validate_a_range);
api.post('/pruebas/validate-list', [auth.ensureAuth, roles.isBankUser], userBankController.validate_a_list);

api.delete('/formulas/clear-tree', [auth.ensureAuth, roles.isBankUser], userBankController.clear_tree);


//
api.get('/pruebas/solicitudes', [auth.ensureAuth, roles.isBankUser], userBankController.get_histoy_cred_req);


module.exports = api;
