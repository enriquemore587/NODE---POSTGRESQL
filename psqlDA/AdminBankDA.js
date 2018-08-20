'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var log = require('log4js').getLogger("AdminBankDA");


exports.get_a_user_for_admin_bank = (params, call) => {
    db.dbR.func('cw.get_a_user_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_a_user_for_admin_bank => ' + err);
            call(false);
        })
}



exports.get_list_users_for_admin_bank = (params, call) => {
    db.dbR.func('cw.get_list_users_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_list_users_for_admin_bank => ' + err);
            call(false);
        })
}




exports.get_list_users_for_admin_bank_like_email = (params, call) => {
    db.dbR.func('cw.get_list_users_for_admin_bank_like_email', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_list_users_for_admin_bank_like_email => ' + err);
            call(false);
        })
}



exports.get_list_users_for_admin_bank_like_num = (params, call) => {
    db.dbR.func('cw.get_list_users_for_admin_bank_like_num', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_list_users_for_admin_bank_like_num => ' + err);
            call(false);
        })
}



exports.update_user_data_from_admin = (params, call) => {
    db.dbW.func('cw.update_user_data_from_admin', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('update_user_data_from_admin => ' + err);
            call(false);
        })
}



exports.get_profiles_for_admin_bank = (params, call) => {
    db.dbR.func('cw.get_profiles_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_profiles_for_admin_bank => ' + err);
            call(false);
        })
}



exports.create_user_bank_for_admin_bank = (params, call) => {
    db.dbW.func('cw.create_user_bank_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('create_user_bank_for_admin_bank => ' + err);
            if (err.constraint == "RFC") return call(false, { status: 6000, message: 'RFC' });
            else if (err.constraint == "CURP") return call(false, { status: 6000, message: 'CURP' });
        })
}




exports.get_down_reasons_for_admin_bank = (params, call) => {
    db.dbR.func('cw.get_down_reasons_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_down_reasons_for_admin_bank => ' + err);
            call(false);
        })
}




exports.up_down_user_bank_for_admin_bank = (params, call) => {
    db.dbW.func('cw.up_down_user_bank_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('up_down_user_bank_for_admin_bank => ' + err);
            call(false);
        })
}



exports.get_bitacora_usuarios_for_admin_bank = (params, call) => {
    db.dbR.func('cw.get_bitacora_usuarios_for_admin_bank', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_bitacora_usuarios_for_admin_bank => ' + err);
            call(false);
        })
}
