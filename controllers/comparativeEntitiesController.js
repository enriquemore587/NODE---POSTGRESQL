'use strinct'

var comparativeDA = require('../psqlDA/comparativeEntitiesDA');

var requesProcessDA = require('../psqlDA/requesProcessDA');

var response = {};

function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}
var comparative = function(req, res) {
   var id_user = '00000000-0000-0000-0000-000000000000';


  if (!req.query.amount || !req.query.term || !req.query.term_type || !req.query.id_bank) {
    requesProcessDA.set_request_process(id_user, 9, false, 'missing parameters');
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    comparativeDA.comparative(req.query, resp => {
      if (!resp || resp.length == 0) {
        requesProcessDA.set_request_process(id_user, 9, false, 'Without Results');
        msg(1001, 'Without Results', {});
        res.status(200).send(response);
      } else {
        //console.log('resultado ?=' + calculo(10000,18,8));

        if (req.query.term_type <= 0 || req.query.term_type >= 4) {
          requesProcessDA.set_request_process(id_user, 9, false, 'Without Results');
          msg(1001, 'Without Results', {});
          res.status(200).send(response);
        }
        // console.log(resp);
        var tbComparative = [];
        for (let i = 0; i < resp.length; i++) {
          var interest_rate;
          var amount_pay;
          if (req.query.term_type == 1) {
            interest_rate = resp[i].monthly;
            amount_pay =  calculo(req.query.amount,req.query.term,resp[i].monthly);
          } else if (req.query.term_type == 2) {
            interest_rate = resp[i].biweekly;
            amount_pay =  calculo(req.query.amount,req.query.term,resp[i].biweekly);
          } else if (req.query.term_type == 3) {
            interest_rate = resp[i].weekly;
            amount_pay = calculo(req.query.amount,req.query.term,resp[i].weekly);
          }


          tbComparative.push({
            'id': resp[i].id,
            'name_bank': resp[i].name_bank,
            'key_bank': resp[i].key_bank,
            'online_service': resp[i].online_service,
            'id_ciconfig': resp[i].id_ciconfig,
            'cat': resp[i].cat,
            'interest_rate': interest_rate,
            'amount_pay_term': amount_pay
          });
        }
        // console.log(tbComparative);
        if (req.query.term_type > 0 && req.query.term_type < 4) {
            requesProcessDA.set_request_process(id_user, 9, true, 'Successful');
          msg(0, 'Successful', tbComparative);
          res.status(200).send(response);
        }

      }
    });
  }
};



const calculo = (cuota, plazo, inte) => {
  let interes = parseFloat(inte / 100);
  plazo = plazo * (-1);
  let _potencia = Math.pow((1 + interes), plazo);
  let arriba = parseFloat(interes) * parseFloat(cuota);
  let abajo = 1 - _potencia;
  return arriba / abajo;
}


module.exports = {
  comparative
};
