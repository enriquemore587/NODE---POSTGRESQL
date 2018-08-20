'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var moment = require("moment");

var log = require('log4js').getLogger("SESSIONS DA CONTROLLER");

exports.login = function (data, call) {
  validate_login(data, function (res) {
    if (!res.status) {
      call(false);
    } else {
      db.dbR.func('cw.login_user', [res.id_user])
        .then(data => {
          //  console.log(data);

          call(data[0]);
        })
        .catch(err => {
          //  console.error(err);
          call(err[0]);
        });
    }
  });
};

exports.loginUserBank = function (data, call) {
  validate_login(data, function (res) {
    if (!res.status) {
      call(false);
    } else {
      db.dbR.func('cw.login_user_bank', [res.id_user])
        .then(data => {
          call(data[0]);
        })
        .catch(err => {
          console.error(err);
          call(err[0]);
        });
    }
  });
};

exports.getFirstMenuBank = function (id_profile, call) {
  db.dbR.func('cw.get_first_menu_bank', [id_profile])
    .then(data => {
      call(data);
    })
    .catch(err => {
      console.error(err);
      call(err[0]);
    })
}

var validate_login = function (data, call) {
  db.dbR.func('cw.login_valid', [data.email, data.pwd])
    .then(data => {
      call(data[0]);
    })
    .catch(err => {
      console.error(err);
      call(err[0]);
    })
}

exports.register = function (data, call) {
  var now = new moment();
  var date = now.format('YYYY-MM-DD HH:mm:ss');
  db.dbW.func('cw.reg_user', [data.email, data.pwd, date, data.option])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(error => {
      db.dbW.end;
      call(error);
    });
};

exports.account_activation = function (data, call) {
  var now = new moment();
  var date = now.format('YYYY-MM-DD HH:mm:ss');
  db.dbW.func('cw.set_code_activation', [data.mail, data.code, date])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(error => {
      db.dbW.end;
      call(error);
    });
};

exports.code_forwarding = function (data, call) {
  db.dbW.func('cw.get_code_activation', [data.mail])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(error => {
      db.dbW.end;
      call(error);
    });
}


exports.forgot_pwd = function (data, call) {
  db.dbW.func('cw.set_assign_pwd', [data.mail, data.pwd])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(error => {
      db.dbW.end;
      call(error);
    });
}

exports.change_pwd = function (data, call) {
  db.dbW.func('cw.set_change_pwd', [data.id_user, data.pwd, data.pwdnew])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(error => {
      db.dbW.end;
      call(error);
    });
}

exports.set_a_uuid_files_user = (params, call) => {
  db.dbW.func('cw.set_a_uuid_files_user', params)
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('set_a_uuid_files_user => ' + err);
      call(false);
    })
}



exports.create_registry_login = (params, call) => {
  db.dbW.func('cw.create_registry_login', params)
    .then(data => {
      db.dbW.end;
      console.log(data);
      //          call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('create_registry_login => ' + err);
      //call(false);
    })
}
