'use strinct'

var validateDA = require('../psqlDA/validateDA');

var response = {};

function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}

var blacklist = function(req, res) {
  var result = {};
  validateDA.back_list(req.user, resp => {
    if (resp[0] != null) {
      result.result = true;
      msg(0, 'Successful', result);
    } else {
      msg(1001, 'Not data', {});
    }
    res.status(200).send(response);
  });
};

var evaluateCredit = function(req, res) {
  if (!req.query.amount || !req.query.term || !req.query.term_type || !req.query.id_bank) {
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    validateDA.data_bank_credit(req.query, resp => {
      if (!resp || resp.length == 0) {
        msg(1001, 'Without Results', {});
        res.status(200).send(response);
      } else {
        console.log(resp);
        //console.log('resultado ?=' + calculo(10000,18,8));

        if (req.query.term_type <= 0 || req.query.term_type >= 4) {
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
            amount_pay = calculo(req.query.amount, req.query.term, resp[i].monthly);
          } else if (req.query.term_type == 2) {
            interest_rate = resp[i].biweekly;
            amount_pay = calculo(req.query.amount, req.query.term, resp[i].biweekly);
          } else if (req.query.term_type == 3) {
            interest_rate = resp[i].weekly;
            amount_pay = calculo(req.query.amount, req.query.term, resp[i].weekly);
          }

          var tbAmort = [];
          for (let j = 0; j <= req.query.term.length; j++) {
            tbAmort.push({
              "pay": j + 1,
              "amount_pay": amount_pay
            });
          }

          tbComparative.push({
            'amount': req.query.amount,
            'term': req.query.term,
            'term_type': req.query.term_type,
            'cat': resp[i].cat,
            'interest_rate': interest_rate,
            'amount_pay_term': amount_pay,
            'approved': true,
            'amortization_table': tbAmort
          });
        }
        // console.log(tbComparative);
        if (req.query.term_type > 0 && req.query.term_type < 4) {
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
  blacklist,
  evaluateCredit
};
