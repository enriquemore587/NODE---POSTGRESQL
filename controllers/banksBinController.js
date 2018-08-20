'use strinct'

var banksBinDA = require('../psqlDA/banksBinDA');

var clabe = require('clabe-validator');

var requesProcessDA = require('../psqlDA/requesProcessDA');

var response = {};

function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}

var validate_bin = function(req, res) {
  if (!req.query.bin) {
    requesProcessDA.set_request_process(req.user.id_user, 6, false, 'missing parameters');
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    banksBinDA.validate(req.query, resp => {
      if (resp.status == 0) {
        requesProcessDA.set_request_process(req.user.id_user, 6, true, 'Successful');
        msg(0, 'Successful', {
          scheme: resp.scheme,
          bank_name: resp.bank_name
        });
        res.status(200).send(response);
      } else {
        requesProcessDA.set_request_process(req.user.id_user, 6, false, 'Not Data');
        msg(1001, 'Not Data', {});
        res.status(200).send(response);
      }
    });
  }
};

var validate_clabe = function(req, res) {
  if (!req.query.clabe) {
    requesProcessDA.set_request_process(req.user.id_user, 7, false, 'missing parameters');
    msg(1000, 'missing parameters', {});
  } else {
    var clabeCheck = clabe.validate(req.query.clabe);
    requesProcessDA.set_request_process(req.user.id_user, 7, true, 'Successful');
    //console.log(clabeCheck.error ? '¡Muy mal!' : '¡Que bueno!');
    msg(0, 'Successful', {
      "valid": clabeCheck.error,
      "bank": clabeCheck.bank
    });

  }

  res.status(200).send(response);
};



module.exports = {
  validate_bin,
  validate_clabe
};
