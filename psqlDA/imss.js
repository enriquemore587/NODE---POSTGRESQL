'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var log = require('log4js').getLogger("IMSS - DA");

exports.set_imss_deposit = (params, call) => {
    db.dbW.func('cw.set_imss_deposit', params)
        .then(data => {
            db.dbW.end;
            call(data[0]);
        })
        .catch(err => {
            db.dbW.end;
            log.error('set_imss_deposit => ' + err);
            call(false); 
        })
}
