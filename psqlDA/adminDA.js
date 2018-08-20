'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var log = require('log4js').getLogger("USUARIOS OCR - DA");

exports.get_users_list = (params, call) => {
    db.dbR.func('cw.get_users_list', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_users_list => ' + err);
            call(false); 
        })
}

exports.get_general_information_user = (params, call) => {
    db.dbR.func('cw.get_general_information_user', params)
        .then(data => {
            db.dbW.end;
            call(data[0].response);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_general_information_user => ' + err);
            call(false); 
        })
}

exports.get_locations_by_user_success = (params, call) => {
    db.dbR.func('cw.get_locations_by_user_success', params)
        .then(data => {
            db.dbW.end;
            call(data);
        })
        .catch(err => {
            db.dbW.end;
            log.error('get_locations_by_user_success => ' + err);
            call(false); 
        })
}