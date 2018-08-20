var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var moment = require("moment");

var log = require('log4js').getLogger("USERS BANK - DA");

/**
 * 
 * in_category_id = 1 => Indicadores de Buró  ||  2 => Perfil de cliente
 * id_bank
 */
var GET_VARS_TO_CHECK = (params, call) => {
    db.dbR.func('cw.get_vars_to_check', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('GET_VARS_TO_CHECK => ' + err);
            call(false);
        })
}


var get_all_vars_to_check = (params, call) => {
    db.dbR.func('cw.get_all_vars_to_check', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_all_vars_to_check => ' + err);
            call(false);
        })
}


var get_criterios_indicadores_menu = (params, call) => {
    db.dbR.func('cw.get_criterios_indicadores_menu', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_criterios_indicadores_menu => ' + err);
            call(false);
        })
}

/** 
 * id_bank
 * id_var_fix
 */
var SAVE_VARIABLES_TO_CHECK_INDICADORES = (params, call) => {
    db.dbW.func('cw.set_a_check', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_a_check => ' + err);
            call(false);
        })
}

var set_variables_bank = (params, call) => {
    db.dbW.func('cw.set_variables_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_variables_bank => ' + err);
            call(false);
        })
}

var set_configuration_score = (params, call) => {
    db.dbW.func('cw.set_configuration_score', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_configuration_score => ' + err);
            call(false);
        })
}


var get_icc_bank = (params, call) => {
    db.dbR.func('cw.get_icc_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_icc_bank => ' + err);
            call(false);
        })
}

var get_icc_buro = (params, call) => {
    db.dbR.func('cw.get_icc_buro', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_icc_buro => ' + err);
            call(false);
        })
}

var getHelp_score = (params, call) => {
    db.dbR.func('cw.getHelp_score', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('getHelp_score => ' + err);
            call(false);
        })
}

var change_a_icc_bank = (params, call) => {
    db.dbW.func('cw.change_a_icc_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('change_a_icc_bank => ' + err);
            call(false);
        })
}

var get_score_bank = (params, call) => {
    db.dbR.func('cw.get_score_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_score_bank => ' + err);
            call(false);
        })
}

var set_a_score_bank = (params, call) => {
    db.dbW.func('cw.set_a_score_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_a_score_bank => ' + err);
            call(false);
        })
}


var delete_a_score_bank = (params, call) => {
    db.dbW.func('cw.delete_a_score_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('delete_a_score_bank => ' + err);
            call(false);
        })
}

var get_ocupation = (params, call) => {
    db.dbR.func('cw.get_ocupation', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_ocupation => ' + err);
            call(false); get_ocupation
        })
}

var get_nationalities = (params, call) => {
    db.dbR.func('cw.get_nationalities', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_nationalities => ' + err);
            call(false); get_ocupation
        })
}

var set_a_check_ocupations = (params, call) => {
    db.dbW.func('cw.set_a_check_ocupations_nationalites', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_a_check_ocupations_nationalites => ' + err);
            call(false);
        })
}

var set_a_check_nationalites = (params, call) => {
    db.dbW.func('cw.set_a_check_ocupations_nationalites', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_a_check_nationalites => ' + err);
            call(false);
        })
}

var get_all_vars_banco = (params, call) => {
    db.dbR.func('cw.get_all_vars_banco', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_all_vars_banco => ' + err);
            call(false); get_ocupation
        })
}

var set_a_bank_custom_variable = (params, call) => {
    db.dbW.func('cw.set_a_bank_custom_variable', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_a_bank_custom_variable => ' + err);
            call(false);
        })
}

var get_bak_custom_variables = (params, call) => {
    db.dbR.func('cw.get_bak_custom_variables', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_bak_custom_variables => ' + err);
            call(false); get_ocupation
        })
}

var set_list_bank_custom_variables = (params, call) => {
    console.log(params);
    db.dbW.func('cw.set_list_bank_custom_variables', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_list_bank_custom_variables => ' + err);
            call(false);
        })
}

var get_bank_follow_variables_by_bank = (params, call) => {
    db.dbR.func('cw.get_bank_follow_variables_by_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_bank_follow_variables_by_bank => ' + err);
            call(false); 
        })
}

var get_list_to_validation = (params, call) => {
    db.dbR.func('cw.get_list_to_validation', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_list_to_validation => ' + err);
            call(false); 
        })
}

var get_order_default_variables_by_bank = (params, call) => {
    db.dbR.func('cw.get_order_default_variables_by_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_order_default_variables_by_bank => ' + err);
            call(false); 
        })
}

var get_icc_bank_motor = (params, call) => {
    db.dbR.func('cw.get_icc_bank_motor', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_icc_bank_motor => ' + err);
            call(false);
        })
}

var delete_a_custom_variable = (params, call) => {

    db.dbW.func('cw.delete_a_custom_variable', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('delete_a_custom_variable => ' + err);
            call(false);
        })
}

var clear_tree = (params, call) => {
    db.dbW.func('cw.clear_tree', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('clear_tree => ' + err);
            call(false);
        })
}

var set_variables_will_be_output = (params, call) => {
    
    db.dbW.func('cw.set_variables_will_be_output', params)
        .then(data => {
            db.dbW.end;
            
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_variables_will_be_output => ' + err);
            call(false);
        })
}

var get_histoy_cred_req = (params, call) => {
    db.dbR.func('cw.get_histoy_cred_req', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_histoy_cred_req => ' + err);
            call(false);
        })
}



module.exports = {
    GET_VARS_TO_CHECK,

    get_all_vars_to_check,
    SAVE_VARIABLES_TO_CHECK_INDICADORES,

    get_criterios_indicadores_menu,
    get_icc_bank,
    get_icc_buro,
    getHelp_score,
    set_variables_bank,
    change_a_icc_bank,
    get_score_bank,
    set_a_score_bank,
    set_variables_will_be_output,

    get_ocupation,
    get_nationalities,
    set_a_check_ocupations,
    set_a_check_nationalites,


    get_all_vars_banco,
    set_a_bank_custom_variable,
    get_bak_custom_variables,
    set_list_bank_custom_variables,
    get_bank_follow_variables_by_bank,

    get_list_to_validation,

    get_order_default_variables_by_bank,
    get_icc_bank_motor,
    delete_a_custom_variable,
    clear_tree,
    set_configuration_score,
    delete_a_score_bank,
    get_histoy_cred_req
};
