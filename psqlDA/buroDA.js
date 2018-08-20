'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var moment = require("moment");


var set_request_buro = function(data, call) {
  var now = new moment();
  var date = now.format('YYYY-MM-DD HH:mm:ss');

  db.dbA.func('cw.set_request_buro', [data.id_request_credit, data.request_buro, data.id_response_buro, data.response_buro , date])
    .then(data => {

      db.dbA.end;
      call(data[0]);
    })
    .catch(error => {
  
      db.dbA.end;
      call(error[0]);
    });
};

module.exports = {
  set_request_buro
};
