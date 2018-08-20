'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var moment = require("moment");

var back_list = function(data, call) {
  db.dbR.func('cw.get_data_user_black_list', data.id_user)
    .then(data => {
      call(data);
    })
    .catch(err => {
      console.error(err);
      call(err);
    })
};

var data_bank_credit = function(data, call) {

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
back_list,
data_bank_credit
};
