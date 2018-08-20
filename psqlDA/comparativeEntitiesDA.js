'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var comparative = function(data, call) {

  db.dbR.func('cw.get_credit_bank', [data.amount, data.term,  data.id_bank])
    .then(data => {
      call(data);
    })
    .catch(err => {
      console.error(err);
      call(err);
    })
};



module.exports = {
  comparative
};
