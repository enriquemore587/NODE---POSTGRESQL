'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");


var validate = function(data, call) {

  db.dbR.func('cw.get_validate_bank_bin', [data.bin])
    .then(data => {
      call(data[0]);
    })
    .catch(err => {
      console.error(err);
      call(err[0]);
    })
};

module.exports = {
  validate
};
