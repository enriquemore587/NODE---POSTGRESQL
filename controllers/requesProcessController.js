'use strinct'

var requesProcessDA = require('../psqlDA/requesProcessDA');

var response = {};

function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}

var consult = function(req, res) {
  
    requesProcessDA.get_request_process(req, resp => {
      if (resp != 0) {
        msg(0, 'Successful', resp);
      } else {
        msg(1001, 'Not data', {});
      }
      res.status(200).send(response);

    });
};

module.exports = {
  consult
};
