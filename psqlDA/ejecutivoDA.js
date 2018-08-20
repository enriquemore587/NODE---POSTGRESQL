'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var log = require('log4js').getLogger("EJECUTIVO - DA");

exports.get_user_for_formaliza = (params, call) => {
  db.dbR.func('cw.get_user_for_formaliza', params)
    .then(data => {
      db.dbR.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbR.end;
      log.error('get_user_for_formaliza => ' + err);
      call(false);
    })
};