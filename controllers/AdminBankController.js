'use strict'

//  STATUS  DESCRIPTION
//  1000    missing parameters
//  1200    service error
//  1100    information not found
//  1002    NSS NO VALIDO
//  -2      successful incomplate
//  0       successful

// var ocrService = require('../services/ocr/');

var fs = require('fs');
var log = require('log4js').getLogger("AdminBankController");

var AdminBankDA = require('../psqlDA/AdminBankDA');

var fs = require('fs');

function missingParams() {
    return {
        status: 1000,
        message: "missing parameters"
    };
}

function msg(status, message, data) {
    let response = {};
    response.status = status;
    response.message = message;
    response.data = data;
    return response;
}

exports.get_a_user_for_admin_bank = (req, res) => {
    if (!req.query.user_id) return res.send(missingParams());
    AdminBankDA.get_a_user_for_admin_bank([req.query.user_id], (generalinformation) => {
        res.send(msg(0, 'successful', generalinformation));
    });
}


exports.get_list_users_for_admin_bank = (req, res) => {
    AdminBankDA.get_list_users_for_admin_bank([req.user.id_bank], (generalinformation) => {
        if (generalinformation) res.send(msg(0, 'successful', generalinformation));
        else res.send(msg(1200, 'service error'));
    });
}


exports.get_list_users_for_admin_bank_like_email = (req, res) => {
    AdminBankDA.get_list_users_for_admin_bank_like_email([req.user.id_bank, req.query.input], (generalinformation) => {
        if (generalinformation) res.send(msg(0, 'successful', generalinformation));
        else res.send(msg(1200, 'service error'));
    });
}


exports.get_list_users_for_admin_bank_like_num = (req, res) => {
    AdminBankDA.get_list_users_for_admin_bank_like_num([req.user.id_bank, req.query.input], (generalinformation) => {
        if (generalinformation) res.send(msg(0, 'successful', generalinformation));
        else res.send(msg(1200, 'service error'));
    });
}

exports.update_user_data_from_admin = (req, res) => {
    if (!req.body.user_id, !req.body.rfc, !req.body.num_client, !req.body.email, !req.body.name, !req.body.name2, !req.body.last_name, !req.body.last_name2, !req.body.profile)
        return res.send(missingParams());

    AdminBankDA.update_user_data_from_admin([req.body.user_id, req.body.rfc, req.body.num_client, req.body.email, req.body.name, req.body.name2, req.body.last_name, req.body.last_name2, req.body.profile], (generalinformation) => {
        res.send(msg(0, 'successful', generalinformation.status));
    });
}


exports.get_profiles_for_admin_bank = (req, res) => {
    AdminBankDA.get_profiles_for_admin_bank([], (generalinformation) => {
        res.send(msg(0, 'successful', generalinformation));
    });
}



exports.create_user_bank_for_admin_bank = (req, res) => {
    if (!req.body.rfc, !req.body.email, !req.body.pwd, !req.body.name, !req.body.name2, !req.body.last_name, !req.body.last_name2, !req.body.profile)
        return res.send(missingParams());

    AdminBankDA.create_user_bank_for_admin_bank([req.body.email, req.body.pwd, req.user.id_bank, req.body.profile, req.body.name, req.body.name2, req.body.last_name, req.body.last_name2, req.body.rfc], (error, typeError) => {
        if (!error)
            return res.send(typeError);

        //res.send(msg(0, 'successful'));
        AdminBankDA.up_down_user_bank_for_admin_bank([error.status, true, 3, 'ALTA', req.user.id_user], (response) => {
            if (response.status == 'success')
                res.send(msg(0, 'successful'));
            else
                res.send(msg(1200, 'service error'));
        });
    });
}


exports.up_down_user_bank_for_admin_bank = (req, res) => {
    if (!req.body.user_id || !req.body.up_down == undefined || !req.body.reason || !req.body.commentary || !req.user.id_user)
        return res.send(missingParams());

    AdminBankDA.up_down_user_bank_for_admin_bank([req.body.user_id, req.body.up_down, req.body.reason, req.body.commentary, req.user.id_user], (response) => {
        if (response.status == 'success')
            res.send(msg(0, 'successful'));
        else
            res.send(msg(1200, 'service error'));
    });
}

exports.get_down_reasons_for_admin_bank = (req, res) => {
    AdminBankDA.get_down_reasons_for_admin_bank([], (generalinformation) => {
        if (generalinformation) res.send(msg(0, 'successful', generalinformation));
        else res.send(msg(1200, 'service error'));
    });
}


exports.get_bitacora_usuarios_for_admin_bank = (req, res) => {
    AdminBankDA.get_bitacora_usuarios_for_admin_bank([req.user.id_bank], (lista) => {
        if (lista) res.send(msg(0, 'successful', lista));
        else res.send(msg(1200, 'service error'));
    });
}
