'use strinct'

var log = require('log4js').getLogger("SESSIONS CONTROLLER");

var sessionDA = require('../psqlDA/sessionDA');

var randomstring = require("randomstring");

var sha256 = require("sha256");

var jwtService = require('../services/auth');

var mail = require('../services/emails/mailsConfig');

var requesProcessDA = require('../psqlDA/requesProcessDA');

var response = {};



var login = function (req, res) {
  var id_user = '00000000-0000-0000-0000-000000000000';
  if (!req.body.email || !req.body.pwd) {
    requesProcessDA.set_request_process(id_user, 1, false, 'missing parameters');
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    sessionDA.login(req.body, resp => {
      //console.log(resp);
      if (!resp) {
        requesProcessDA.set_request_process(id_user, 1, false, 'User or password incorrect');
        msg(1001, 'User or password incorrect', {});
        res.status(200).send(response);
      } else {
        requesProcessDA.set_request_process(resp.id_user, 1, true, 'Successful');
        resp.token = jwtService.createToken(resp);
        msg(0, 'Successful', resp);
        res.status(200).send(response);
      }
    });
  }
}

var loginUserBank = function (req, res) {
  var id_user = '00000000-0000-0000-0000-000000000000';
  if (!req.body.email || !req.body.pwd) {
    requesProcessDA.set_request_process(id_user, 1, false, 'missing parameters');
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    let respuesta = {};
    sessionDA.loginUserBank(req.body, resp => {
      if (!resp) {
        requesProcessDA.set_request_process(id_user, 1, false, 'User or password incorrect');
        msg(1001, 'User or password incorrect', {});
        res.status(200).send(response);
      } else {
        respuesta.token = jwtService.createToken(resp);
        respuesta.name_profile = resp.name_profile;
        respuesta.nombre_usuario = resp.nombre_usuario;
        sessionDA.getFirstMenuBank(resp.id_profile, menu => {
          if (!resp) {
            requesProcessDA.set_request_process(id_user, 1, false, 'User or password incorrect');
            msg(1001, 'User or password incorrect', menu);
            res.status(200).send(response);
          } else {
            respuesta.menu = menu;
            requesProcessDA.set_request_process(resp.id_user, 1, true, 'Successful');
            msg(0, 'Successful', respuesta);
            response.data.id_bank = resp.id_bank;
            res.status(200).send(response);
            sessionDA.create_registry_login([resp.id_user]);
          }
        });
      }
    });
  }
}

var register = function (req, res) {
  var option = 1;
  var expRegTel = new RegExp("^\\+?\\d{1,3}?[- .]?\\(?(?:\\d{2,3})\\)?[- .]?\\d\\d\\d[- .]?\\d\\d\\d\\d$", "g");
  if (!req.body.email || !req.body.pwd || !req.body.temporalToken) {
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {

    if (expRegTel.test(req.body.email)) {
      option = 2;
    }
    var user_id_new = '',
      user_id_old = req.body.temporalToken ? req.body.temporalToken : '00000000-0000-0000-0000-000000000000';

    req.body.option = option;
    sessionDA.register(req.body, (resp) => {
      if (resp.out_status == 0) {
        // if (option == 1) { //Solo se envia email cuando el registro es por email
        //   mail.sendMail(req.body.email, '<h1> Email: ' + req.body.email + ' </h>' + '<h1> Password:' + req.body.pwd + ' </h>', 'Activacion de Cuenta');
        // }
        // Login despues de crear el usuario
        sessionDA.login(req.body, respLogin => {
          user_id_new = respLogin.id_user;
          sessionDA.set_a_uuid_files_user([user_id_new, user_id_old], successChange => {
            if (successChange.status != 0)
              log.error(`ERROR AL ASIGNAR DOCUMENTOS AL USUARIO. ID NO ENCONTRADO => ${user_id_old}`);
            var token = jwtService.createToken(respLogin);
            msg(0, 'Successful', { token: token });
            res.status(200).send(response);
          });
        });
        //Aqui va el codigo para en vio de mensajes de text cuando el registro es por numero telefonico
        // msg(0, 'Successful', {});
        // res.status(200).send(response);
      } else {
        msg(1001, 'User not available', {});
        res.status(200).send(response);
      }
    });
  }
};

var account_activation = function (req, res) {
  var option = 1;
  var expRegTel = new RegExp("^\\+?\\d{1,3}?[- .]?\\(?(?:\\d{2,3})\\)?[- .]?\\d\\d\\d[- .]?\\d\\d\\d\\d$", "g");
  if (!req.query.mail || !req.query.code) {
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    if (expRegTel.test(req.query.mail)) {
      option = 2;
    }
    sessionDA.account_activation(req.query, (resp) => {
      if (resp.status == 0) {
        if (option == 1) { //Solo se envia email cuando el registro es por email
          mail.sendMail(req.query.mail, '<h1>Cuenta Activa</h>', 'Cuenta Activada');
        }
        msg(0, 'Successful', {});
        res.status(200).send(response);
      } else if (resp.status == -3) {
        msg(1002, 'invalid code', {});
        res.status(200).send(response);
      } else {
        msg(1001, 'Error, try later', {});
        res.status(200).send(response);
      }
    });
  }
};


var code_forwarding = function (req, res) {
  var option = 1;
  var expRegTel = new RegExp("^\\+?\\d{1,3}?[- .]?\\(?(?:\\d{2,3})\\)?[- .]?\\d\\d\\d[- .]?\\d\\d\\d\\d$", "g");
  if (!req.query.mail) {
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    if (expRegTel.test(req.query.mail)) {
      option = 2;
    }
    sessionDA.code_forwarding(req.query, (resp) => {
      if (!resp.out_code) {
        msg(1001, 'Error, Unregistered user', {});
        res.status(200).send(response);
      } else {
        if (option == 1) { //Solo se envia email cuando el registro es por email
          mail.sendMail(req.query.mail, '<h1>' + resp.out_code + ' </h>', 'Activacion de Cuenta');
        }
        msg(0, 'Successful', {});
        res.status(200).send(response);
      }
    });

  }
};
var forgot_pwd = function (req, res) {
  var option = 1;
  var expRegTel = new RegExp("^\\+?\\d{1,3}?[- .]?\\(?(?:\\d{2,3})\\)?[- .]?\\d\\d\\d[- .]?\\d\\d\\d\\d$", "g");
  if (!req.query.mail) {
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    if (expRegTel.test(req.query.mail)) {
      option = 2;
    }
    var pwd = randomstring.generate(8);
    req.query.pwd = sha256(pwd);
    sessionDA.forgot_pwd(req.query, (resp) => {
      if (resp.status == 0) {
        if (option == 1) { //Solo se envia email cuando el registro es por email
          mail.sendMail(req.query.mail, '<h1>' + pwd + ' </h>', 'Password Temporal');
        }
        msg(0, 'Successful', {});
        res.status(200).send(response);
      } else if (resp.status == -2) {
        msg(1002, 'Error, Invalid email', {});
        res.status(200).send(response);
      } else {
        msg(1001, 'Error, try later', {});
        res.status(200).send(response);
      }
    });
  }
};

var change_pwd = function (req, res) {
  if (!req.query.pwd || !req.query.pwdnew) {
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    req.query.id_user = req.user.id_user;
    sessionDA.change_pwd(req.query, (resp) => {
      if (resp.status == 0) {
        msg(0, 'Successful', {});
        res.status(200).send(response);
      } else if (resp.status == -2) {
        msg(1002, 'Error, verify password', {});
        res.status(200).send(response);
      } else {
        msg(1001, 'Error, try later', {});
        res.status(200).send(response);
      }
    });

  }


};

function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}

module.exports = {
  register,
  login,
  account_activation,
  code_forwarding,
  forgot_pwd,
  change_pwd,

  loginUserBank
};
