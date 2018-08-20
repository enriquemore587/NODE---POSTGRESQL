'use strict'

/*    R E S P O N S E
1000  =>  missing parameters
5000  =>  E R R O R - G E N E R A L
1200  =>  {T Y P E - D A T A}
1100  =>  U S U A R  I O - N O - E X I S T E
0     =>  successful    || no information
*/

var userBankDA = require('../psqlDA/userBankDA');
var log = require('log4js').getLogger("USUARIOS BANCOS CONTROLLER");


Array.prototype.unique = function (a) {
    return function () {
        return this.filter(a)
    }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});


function msg(status, message, data) {
    let response = {};
    response.status = status;
    response.message = message;
    response.data = data;
    return response;
}

function missingParams() {
    return {
        status: 1000,
        message: "missing parameters"
    };
}


var GET_VARS_TO_CHECK_INDICADORES = (req, res) => {
    /**
     * 
     * in_category_id = 1 => Indicadores de Buró  ||  2 => Perfil de cliente
     * id_bank
     */
    let endList = [];
    let categoria = 1;
    userBankDA.get_all_vars_to_check([categoria], resp1 => {
        
        if (!resp1) return res.send(msg(0, 'no information1', {}));
        userBankDA.GET_VARS_TO_CHECK([req.user.id_bank, categoria], resp2 => {
            if (!resp2) return res.send(msg(0, 'no information2', {}));
            if (resp2.length > 0) {
                resp1.forEach(element1 => {
                    let boll = false;
                    resp2.forEach(element2 => {
                        if (element1.id == element2.id) {
                            boll = true;
                            endList.push(element2);
                        }
                    });
                    
                    if (boll == false) endList.push(element1);
                });
                return res.send(msg(0, 'successful', endList));
            }
            else return res.send(msg(0, 'successful', resp1));
        });

    });
}

var GET_VARS_TO_CHECK_PERFIL_CLIENTE = (req, res) => {
    /**
     * in_category_id = 1 => Indicadores de Buró  ||  2 => Perfil de cliente
     * id_bank
     */
    let endList = [];
    let categoria = 2;
    userBankDA.get_all_vars_to_check([categoria], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information 1', {}));
        userBankDA.GET_VARS_TO_CHECK([req.user.id_bank, categoria], resp2 => { 
            if (!resp2) return res.send(msg(0, 'no information 2', {}));
            if (resp2.length > 0) {
                resp1.forEach(element1 => {
                    let boll = false;
                    resp2.forEach(element2 => {
                        if (element1.id == element2.id) {
                            boll = true;
                            endList.push(element2);
                        }
                    });
                    if (boll == false) endList.push(element1);
                });
                return res.send(msg(0, 'successful', endList));
            }
            else return res.send(msg(0, 'successful', resp1));
        });

    });
}

var SAVE_VARIABLES_TO_CHECK_INDICADORES = function (req, res) {
    if (!req.body.id_var_fix || req.body.active == undefined) {
        res.status(200).send(msg(1000, 'missing parameters', {}));
    } else {

        userBankDA.SAVE_VARIABLES_TO_CHECK_INDICADORES([req.body.id_var_fix, req.user.id_bank, req.body.active], response => {
            
            if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
            if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
            if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

            res.send(msg(0, 'successful'));

        });

    }
}

var set_variables_bank = function (req, res) {
    //  1 => producto uno
    userBankDA.set_variables_bank([req.body.id_var_fix, req.user.id_bank, req.body.range, req.body.is_ok, req.body.ver_array, 1], response => {
        
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful'));

    });
}

var set_configuration_score = function (req, res) {
    
    userBankDA.set_configuration_score([req.user.id_bank, req.body.in_range, req.body.in_deadline, req.body.in_credit_limit], response => {
               
        if (response.status != 0) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful'));

    });
}

var get_criterios_indicadores_menu = (req, res) => {
        // id_bank, id_categoria, id_producto
    userBankDA.get_criterios_indicadores_menu([req.user.id_bank, 1, 1], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}



var get_icc_buro = (req, res) => {
    
    if (req.query.icc > 9 || req.query.icc < 4) return res.send(msg(0, 'request imposible, range is 4-9', {}));
    
    userBankDA.get_icc_buro([req.query.icc], resp => {
        if (!resp) return res.send(msg(0, 'no information', {}));

        else return res.send(msg(0, 'successful', resp));

    });
}

var get_icc_bank = (req, res) => {
    
    if (req.query.icc > 9 || req.query.icc < 4) return res.send(msg(0, 'request imposible, range is 4-9', {}));
    
    userBankDA.get_icc_bank([req.user.id_bank, req.query.icc], resp => {
        if (!resp) return res.send(msg(0, 'no information', {}));

        else return res.send(msg(0, 'successful', resp));

    });
}

var getHelp_score = (req, res) => {

    userBankDA.getHelp_score([req.query.start], resp => {
        if (!resp) return res.send(msg(0, 'no information', {}));
        if (resp[0].status == 0) return res.send(msg(0, 'successful', resp[0].resp));
    });
}

var get_score_bank = (req, res) => {

    userBankDA.get_score_bank([req.user.id_bank], resp => {
        if (!resp) return res.send(msg(0, 'no information', {}));
        return res.send(msg(0, 'successful', resp));
    });

}

var change_a_icc_bank = function (req, res) {    
        
    //  1 => producto uno
    userBankDA.change_a_icc_bank([req.body.icc, req.user.id_bank, req.body.value], response => {
        
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}

var set_a_score_bank = function (req, res) {

    //  1 => producto uno
    userBankDA.set_a_score_bank([req.body.id, req.user.id_bank, req.body.desde+"-"+req.body.range, req.body.plazo], response => {
        
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}

var delete_a_score_bank = function (req, res) {

    userBankDA.delete_a_score_bank([req.body.id_score], response => {
        
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status != 0) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}


//
var get_criterios_cliente_menu = (req, res) => {
    // id_bank, id_categoria, id_producto
    userBankDA.get_criterios_indicadores_menu([req.user.id_bank, 2, 1], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}

var get_ocupation = (req, res) => {
    // id_bank, id_categoria, id_producto
    userBankDA.get_ocupation([], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}

var get_nationalities = (req, res) => {
    // id_bank, id_categoria, id_producto
    userBankDA.get_nationalities([], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}

var set_a_check_ocupations = function (req, res) {

    //  8 => ocupaciones
    userBankDA.set_a_check_ocupations([req.user.id_bank, req.body.value, 8], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}

var set_a_check_nationalites = function (req, res) {

    //  9 => nationalites
    userBankDA.set_a_check_nationalites([req.user.id_bank, req.body.value, 9], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}


/// calculadora
var get_all_vars_banco = (req, res) => {
    userBankDA.get_all_vars_banco([req.user.id_bank], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}

var set_a_bank_custom_variable = function (req, res) {
    //  1 => producto
    userBankDA.set_a_bank_custom_variable([req.user.id_bank, req.body.expression, 1, req.body.id, req.body.nombre], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}

var get_bak_custom_variables = (req, res) => {
    userBankDA.get_bak_custom_variables([req.user.id_bank], resp => {
        if (!resp) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp));
    });
}

var set_list_bank_custom_variables = function (req, res) {
    userBankDA.set_list_bank_custom_variables([req.body.ids, req.user.id_bank], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'B A N K - N O - E X I S T E', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}

var get_bank_follow_variables_by_bank = (req, res) => {
    userBankDA.get_bank_follow_variables_by_bank([req.user.id_bank], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}

var validacionFormulasService = require('../services/usersBank/validacionFormulasService');

var get_list_to_validation = (req, res) => {
    userBankDA.get_list_to_validation([req.user.id_bank], resp => {
        if (!resp) return res.send(msg(0, 'no information', {}));
        else{
            let defaultVariables = [], customVariables = [];
            resp.forEach(element => {
                if (!element.cat) {
                    defaultVariables.push({
                        id: element.id,
                        name: element.name,
                        rango: element.rango,
                        is_ok: element.is_ok,
                        var_array: element.var_array,
                        short: element.short,
                        id_bank_variables: element.id_bank_variables
                    });
                }else{
                    customVariables.push({
                        id: element.id,
                        name: element.name,
                        expresion: element.expresion
                    });
                }
                
            });
            
            let variables = validacionFormulasService.GET_DEFAULT_VARIABLES_WITH_RESTRICTIONS(defaultVariables);
            let variables2 = validacionFormulasService.GET_CUSTOM_VARIABLES(customVariables);
            return res.send(msg(0, 'successful', {default: variables, custom: customVariables}));
        }
    });
}

var validate_a_range = (req, res) => {
    if (!req.body.range || !req.body.input) return res.send(missingParams());
    let resp = validacionFormulasService.VALIDATE_RANGE(req.body.range, req.body.input);
    return res.send(msg(0, 'successful', resp));
}

var validate_a_list = (req, res) => {
    if (!req.body.list || !req.body.input) return res.send(missingParams());
    let resp = validacionFormulasService.VALIDATE_LIST(req.body.list, req.body.input);
    return res.send(msg(0, 'successful', resp));
}

var get_order_default_variables_by_bank = (req, res) => {
    userBankDA.get_order_default_variables_by_bank([req.user.id_bank], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else return res.send(msg(0, 'successful', resp1));
    });
}

var delete_a_custom_variable = function (req, res) {
    userBankDA.delete_a_custom_variable([req.params.id], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status != 0) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}

var set_variables_will_be_output = function (req, res) {
    userBankDA.set_variables_will_be_output([req.user.id_bank, req.body.id_mensualidad, req.body.id_plazo, req.body.id_linea_credito, req.body.id_tasa], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status != 0) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful', response));

    });

}


var clear_tree = function (req, res) {
    userBankDA.clear_tree([req.user.id_bank], response => {

        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));

        res.send(msg(0, 'successful'));

    });

}

var get_histoy_cred_req = (req, res) => {
    userBankDA.get_histoy_cred_req([req.user.id_bank], resp1 => {
        if (!resp1) return res.send(msg(0, 'no information', {}));
        else {
            resp1.forEach(registro => {
                registro.content = JSON.parse(registro.content);
            });
            return res.send(msg(0, 'successful', resp1));
        }
    });
}


module.exports = {
    GET_VARS_TO_CHECK_INDICADORES,
    GET_VARS_TO_CHECK_PERFIL_CLIENTE,

    SAVE_VARIABLES_TO_CHECK_INDICADORES,

    get_criterios_indicadores_menu,
    get_icc_bank,
    get_icc_buro,
    getHelp_score,
    set_variables_bank,
    change_a_icc_bank,
    get_score_bank,
    set_a_score_bank,
    delete_a_score_bank,

    get_criterios_cliente_menu,
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
    validate_a_range,
    validate_a_list,
    
    get_order_default_variables_by_bank,

    delete_a_custom_variable,
    set_variables_will_be_output,

    clear_tree,
    set_configuration_score,
    get_histoy_cred_req

}
