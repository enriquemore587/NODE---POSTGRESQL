'use strict'

/*    R E S P O N S E
1000  =>  missing parameters
5000  =>  E R R O R - G E N E R A L
1200  =>  {T Y P E - D A T A}
1100  =>  U S U A R  I O - N O - E X I S T E
0     =>  successful
*/
// antes de marge 9:33
var usersrDA = require('../psqlDA/usersrDA');
var userBankDA = require('../psqlDA/userBankDA');
var requesProcessDA = require('../psqlDA/requesProcessDA');
var log = require('log4js').getLogger("USUARIOS CONTROLLER");


Array.prototype.unique = function (a) {
  return function () {
    return this.filter(a)
  }
}(function (a, b, c) {
  return c.indexOf(a, b + 1) < 0
});


function msg(status, message, data) {
  let response = {};
  response.status = status;
  response.message = message;
  response.data = data;
  return response;
}

function missingParams() {
  return {
    status: 1000,
    message: "missing parameters"
  };
}


var PERSONAL = (req, res) => {
  let params = req.body;
  params.civil_status = 1;
  if (!params.name || !params.last_name || !params.last_name2 || !params.birthdate || !params.gender || !params.phone || !params.mobile_phone || !params.rfc || !params.curp || !params.nationality || !params.country || !params.american_citizenship || !params.entity_birth || !params.level_study || !params.civil_status || !params.mobile_phone_company || !params.folio_ine || !params.clave_electoral || !params.ocupation_id)
    return res.send(missingParams());
  params.id_user = req.user.id_user;
  if (typeof params.entity_birth == "string") {
    usersrDA.get_id_state_by_code(params.entity_birth, ID_ENTITY => {
      if (typeof ID_ENTITY.exit != 'number') return res.send(msg(5000, 'N O - E X I S T E - E N T I D A D', {}));
      params.entity_birth = ID_ENTITY.exit;
      usersrDA.PERSONAL(params, (response) => {
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'N O - E X I S T E - U S U A R I O', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));
        return res.send(msg(0, 'successful'));
      });
    });
  } else {
    usersrDA.PERSONAL(params, (response, typeError) => {
      if (!response) return res.send(typeError);
      if (response.status == 1100) return res.send(msg(1100, 'N O - E X I S T E - U S U A R I O', {}));
      if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

      return res.send(msg(0, 'successful'));
    });
  }
};

var GET_PERSONAL = (req, res) => {
  usersrDA.GET_PERSONAL(req.user.id_user, resp => {

    if (!resp) return res.send(msg(0, 'no information', {}));
    return res.send(msg(0, 'successful', resp));

  });

};


var GET_ADDRESS = (req, res) => {
  usersrDA.GET_ADDRESS(req.user.id_user, resp => {
    if (!resp) return res.send(msg(0, 'no information', {}));
    return res.send(msg(0, 'successful', resp));
  });
};


var ADDRESS = (req, res) => {

  let params = req.body;

  if (!params.state || !params.municipality || !params.colony || !params.street || !params.ext || !params.int || !params.cp || !params.additional_reference || !params.years_residence || !params.country)
    return res.send(missingParams());
  params.id_user = req.user.id_user;

  if (typeof params.municipality == "string") {
    usersrDA.get_id_municipality_by_id(params.municipality, ID_MUN => {
      if (typeof ID_MUN.exit != 'number') return res.send(msg(5000, 'N O - E X I S T E - M U N I C I P I O', {}));
      params.municipality = ID_MUN.exit;
      usersrDA.ADDRESS(params, response => {
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 1100) return res.send(msg(1100, 'N O - E X I S T E - U S U A R I O', {}));
        if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

        res.send(msg(0, 'successful'));

      });
    });
  } else {
    usersrDA.ADDRESS(params, response => {

      if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
      if (response.status == 1100) return res.send(msg(1100, 'N O - E X I S T E - U S U A R I O', {}));
      if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

      res.send(msg(0, 'successful'));

    });

  }


};


var REFERENCIAS = (req, res) => {
  let params = req.body;
  if (!params.name || !params.phone_number || !params.phone_number_mobile || !params.is_familiar || params.id == undefined)
    return res.send(missingParams());
  params.id_user = req.user.id_user;
  usersrDA.REFERENCIAS(params, response => {

    if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
    if (response.status == 1100) return res.send(msg(1100, 'N O - E X I S T E - U S U A R I O', {}));
    if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));

    res.send(msg(0, 'successful'));

  });

};

var GET_REFERENCIAS = (req, res) => {
  usersrDA.GET_REFERENCIAS(req.user.id_user, resp => {

    if (!resp) return res.send(msg(0, 'no information', {}));
    return res.send(msg(0, 'successful', resp));

  });

};

var save_update_user_payroll_receipt = (req, res) => {
  let params = req.body;
  if (params.id == undefined || !params.fiscal_folio || !params.fecha || !params.monto)
    return res.send(missingParams());
  params.user_id = req.user.id_user;
  usersrDA.save_update_user_payroll_receipt(params, response => {
    if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
    if (response.status == 1100) return res.send(msg(1100, 'N O - E X I S T E - U S U A R I O', {}));
    if (response.status == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));
    if (true) return res.send(msg(0, 'successful'));
  });
};


/*
"estado": "Mexico",
"id_estado": 15,
"colonia": [],
"municipio": []
*/

var ADDRESS_BY_CP = (req, res) => {

  if (!req.query.cp) return res.send(missingParams());

  usersrDA.ADDRESS_BY_CP(req.query, resp => {

    if (!resp) return res.send(msg(0, 'no information', {}));
    return res.send(msg(0, 'successful', resp));

  });

};


var GET_CATALOGOS = (req, res) => {
  usersrDA.GET_CATALOGOS(data => {
    return res.send(msg(0, 'successful', data));
  });
}

var requestCreditService = require('../services/requestCredit');
var set_user_credit_request = (req, res) => {

  if (!req.body.bank_id || !req.body.requested_amount || !req.body.monthly_payment || !req.body.ingreso_declarado || !req.body.plazo_solicitado || req.body.test == undefined) {
    requesProcessDA.set_request_process(req.user.id_user, 10, false, 'missing parameters');
    return res.send(missingParams());
  }
  if (req.body.test && !req.body.request_id) {
    return res.send(missingParams());
  }
  var _request_id = 0;
  usersrDA.set_user_credit_request([req.user.id_user, req.body.bank_id, req.body.requested_amount, req.body.monthly_payment, req.body.ingreso_declarado, req.body.plazo_solicitado, req.body.test], response => {

    if (!response) {
      requesProcessDA.set_request_process(req.user.id_user, 10, false, 'OCURRIO UN PROBLEMA');
      return res.send(msg(1300, 'OCURRIO UN PROBLEMA'));
    }
    if (response.data_user.status == "no information") {
      return res.send(msg(2200, response.data_user.status, response.data_user.status));
    }

    _request_id = response.status;

    userBankDA.get_bank_follow_variables_by_bank([req.body.bank_id], resp1 => {

      if (!resp1) {
        requesProcessDA.set_request_process(req.user.id_user, 10, false, 'no information');
        return res.send(msg(1400, 'no information', {}));
      }

      if (resp1.length == 0) {
        requesProcessDA.set_request_process(req.user.id_user, 10, false, 'Banco no disponible');
        return res.send(msg(0, 'Banco no disponible', {}));
      }

      requestCreditService.user_request_credit(response.data_user, resp1, req.token, req.body, (status, respuesta) => {

        if (!status && respuesta == undefined) {
          requesProcessDA.set_request_process(req.user.id_user, 10, false, 'OCURRIO UN PROBLEMA');
          return res.send(msg(1500, 'OCURRIO UN PROBLEMA', respuesta));
        }
        if (req.body.test) {
          if (status) {
            requesProcessDA.set_request_process(req.user.id_user, 10, true, 'Successful');
            return res.send(msg(0, 'successful', respuesta));
          } else {
            requesProcessDA.set_request_process(req.user.id_user, 10, false, 'CREDITO NO AUTORIZAO');
            return res.send(msg(1200, 'CREDITO NO AUTORIZAO', respuesta));
          }
        } else {
          let end_resp = {
            mensualidad: 0,
            plazo: 0,
            linea_aprobada: 0,
            tasa: 0
          };

          respuesta.forEach(item => {
            if (item.salida == 1) end_resp.mensualidad = item.value;
            if (item.salida == 2) end_resp.plazo = item.value;
            if (item.salida == 3) end_resp.linea_aprobada = item.value;
            if (item.salida == 4) end_resp.tasa = item.value;
          });
          let reason = respuesta[respuesta.length - 1].name;
          let data = JSON.stringify(respuesta);
          if (status) {
            requesProcessDA.set_request_process(req.user.id_user, 10, true, 'Successful');
            usersrDA.set_credit_request_result([_request_id, status, 'APROBADO', data], resp_status => {
              end_resp.folio = resp_status.status;
              usersrDA.set_credit_request_approved([_request_id, end_resp.mensualidad, end_resp.plazo, end_resp.linea_aprobada, end_resp.tasa]);
              return res.send(msg(0, 'successful', end_resp));
            });
          } else {
            requesProcessDA.set_request_process(req.user.id_user, 10, false, 'CREDITO NO AUTORIZAO');

            usersrDA.set_credit_request_result([_request_id, status, reason, data], resp_status => {
              // LO COMENTO POR DUDA SI TIENE QUE DEVOLVER 0 O NO
              // if (resp_status.status == 0) return res.send(msg(1100, 'CREDITO NO AUTORIZADO'));
              // else return res.status(500).send(msg(500, 'Servicio no disponible'));
              if (!resp_status.status) return res.send(msg(1100, 'CREDITO NO AUTORIZADO'));
              else return res.status(500).send(msg(500, 'Servicio no disponible'));

            });
          }
        }

      });

    });

  });

}

var userBankDA = require('../psqlDA/userBankDA');
var get_icc_bank_motor = (req, res) => {
  userBankDA.get_icc_bank_motor([req.query.id_bank, req.query.icc], resp1 => {
    if (!resp1) return res.send(msg(0, 'no information', {}));
    else return res.send(msg(0, 'successful', resp1));
  });
}


var get_all_user = (req, res) => {
  usersrDA.get_all_user(req.user.id_user, resp => {

    if (!resp) return res.send(msg(0, 'no information', {}));
    return res.send(msg(0, 'successful', resp));

  });
}

var get_user_data_all = (req, res) => {
  usersrDA.get_user_data_all(req.user.id_user, resp => {
    if (!resp) return res.send(msg(0, 'no information', {}));
    usersrDA.get_user_payroll_receipt(req.user.id_user, respupr => {
      resp[0].payroll_reciept = respupr;
      return res.send(msg(0, 'successful', resp));
    });
    //return res.send(msg(0, 'successful', resp));
  });
}

var get_user_for_test = (req, res) => {
  let respuesta;
  usersrDA.get_user_for_test([req.user.id_bank], resp => {
    if (!resp) return res.send(msg(0, 'no information', {}));
    return res.send(msg(0, 'successful', resp));
  });
}


module.exports = {

  PERSONAL,
  GET_PERSONAL,
  ADDRESS,
  GET_ADDRESS,
  ADDRESS_BY_CP,
  GET_CATALOGOS,
  REFERENCIAS,
  GET_REFERENCIAS,

  save_update_user_payroll_receipt,

  set_user_credit_request,
  get_icc_bank_motor,

  get_user_data_all,
  get_all_user,

  get_user_for_test

}
