const db = require("../psqlConfig");

var moment = require("moment");

var set_request_process = (id_user, id_request_type, success, error) => {
  var now = new moment();
  var date = now.format('YYYY-MM-DD HH:mm:ss');
  var log = require('log4js').getLogger("requesProcessDA.js");

  db.dbW.func('cw.set_request_process', [id_user, id_request_type, success, error , date])
    .then(data => {
      db.dbW.end;
      return data[0];
    })
    .catch(error => {
      db.dbW.end;
      log.error('set_request_process => ' + error);
      return error[0];
    });

}

var get_request_process = function(data, call) {

  db.dbR.func('cw.get_request_process', [data.query.date])//'2018-06-11 11:00:12'
    .then(data => {
      //console.log(data);
      db.dbR.end;
      call(data);
    })
    .catch(err => {
      db.dbR.end;
      call(0);
    })
};

module.exports = {
  set_request_process,
  get_request_process
};
