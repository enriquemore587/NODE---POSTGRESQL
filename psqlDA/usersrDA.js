'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var moment = require("moment");

var log = require('log4js').getLogger("USUARIOS USERS - DA");

var ADDRESS_BY_CP = function (data, call) {
  db.dbR.func('cw.getCatsByCP', [data.cp])
    .then(data => {
      db.dbR.end;
      let temp = {
        estado: data[0].estado,
        id_estado: data[0].id_estado,
        municipio: data[0].municipio,
        id_municipio: data[0].id_municipio,
        colonias: []
      };
      data.forEach(e => {
        temp.colonias.push(e.colonia);
      });
      call(temp);
    })
    .catch(error => {
      log.error('ADDRESS_BY_CP => ' + error);
      db.dbR.end;
      call(false);
    });
};

var REFERENCIAS = (params, call) => {
  db.dbW.func('cw.referencias', [params.id, params.name, params.phone_number,
  params.phone_number_mobile, params.is_familiar, params.id_user])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      log.error('REFERENCIAS function (referencias) => ' + err);
      db.dbW.end;
      call(false);
    })
};

var PERSONAL = (params, call) => {
  db.dbW.func('cw.information_step1', [params.id_user, params.name, params.name2, params.last_name,
  params.last_name2, params.birthdate, params.gender, params.phone,
  params.mobile_phone, params.rfc, params.curp, params.nationality,
  params.country, params.american_citizenship, params.entity_birth,
  params.level_study, params.civil_status, params.mobile_phone_company,
  params.folio_ine, params.clave_electoral, params.ocupation_id])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      if (err.constraint == "RFC") return call(false, { status: 6000, message: 'RFC' });
      else if (err.constraint == "CURP") return call(false, { status: 6000, message: 'CURP' });
      log.error('PERSONAL function (information_step1) => ' + err);
      call(false,  { status: 5000, message: 'E R R O R - G E N E R A L' });
    })
}

var ADDRESS = (params, call) => {
  db.dbW.func('cw.information_step2', [params.id_user, params.state, params.municipality, params.colony, params.street, params.ext, params.int, params.cp, params.additional_reference, params.years_residence, params.country])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('ADDRESS function (information_step2) => ' + err);
      call(false);
    })
};

var GET_REFERENCIAS = (params, call) => {
  db.dbR.func('cw.getReferencias', [params])
    .then(data => {
      db.dbW.end;
      call(data);
    })
    .catch(err => {
      db.dbW.end;
      log.error('ADDRESS GET_REFERENCIAS (getReferencias) => ' + err);
      call(false);
    })
};

var GET_PERSONAL = (params, call) => {

  db.dbR.func('cw.get_information_step1', [params])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('ADDRESS GET_PERSONAL (get_information_step1) => ' + err);
      call(false);
    })
};

var get_id_state_by_code = (params, call) => {

  db.dbR.func('cw.get_id_state_by_code', [params])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('get_id_state_by_code => ' + err);
      call(false);
    })
};

var get_id_municipality_by_id = (params, call) => {

  db.dbR.func('cw.get_id_municipality_by_id', [params])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('get_id_municipality_by_id => ' + err);
      call(false);
    })
};

var GET_ADDRESS = (params, call) => {

  db.dbR.func('cw.get_information_step2', [params])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('GET_ADDRESS function (get_information_step2) => ' + err);
      call(false);
    })
};

var GET_CATALOGOS = (call) => {
  let catalogos = {};
  db.dbR.func('cw.get_civil_status')
    .then(civil_status => {
      db.dbR.end;
      catalogos.civil_status = civil_status;
      db.dbR.func('cw.get_level_studies')
        .then(level_studies => {
          db.dbR.end;
          catalogos.level_studies = level_studies;
          call(catalogos);
          // db.dbR.func('cw.getcontries')
          //   .then(getcontries => {
          //     db.dbR.end;
          //     catalogos.getcontries = getcontries;
          //     call(catalogos);
          //   })
          //   .catch(error => {
          //     db.dbR.end;
          //     log.error('GET_CATALOGOS function (getcontries) => ' + error);
          //     call(3);
          //   });
        })
        .catch(error => {
          db.dbR.end;
          log.error('GET_CATALOGOS function (get_level_studies) => ' + error);
          call(2);
        });
    })
    .catch(error => {
      db.dbR.end;
      log.error('GET_CATALOGOS function (get_civil_status) => ' + error);
      call(1);
    });
}

var save_update_user_payroll_receipt = (params, call) => {
  db.dbW.func('cw.save_update_user_payroll_receipt', [params.id, params.fiscal_folio, params.fecha, params.monto, params.user_id])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('save_update_user_payroll_receipt => ' + err);
      call(false);
    })
}


var set_user_credit_request = (params, call) => {
  db.dbW.func('cw.set_user_credit_request', params)
    .then(data => {
      db.dbW.end;
      return call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('set_user_credit_request => ' + err);
      return call(false);
    });
}

var get_all_user = (params, call) => {
  db.dbR.func('cw.get_all_user')
    .then(data => {
      db.dbR.end;
      call(data);
    })
    .catch(err => {
      db.dbR.end;
      log.error('get_all_user => ' + err);
      call(false);
    })
};

var get_user_data_all = (params, call) => {
  db.dbR.func('cw.get_user_data_all', params)
    .then(data => {
      db.dbR.end;
      call(data);
    })
    .catch(err => {
      db.dbR.end;
      log.error(err);
      call(false);
    })
}


var get_user_payroll_receipt = (params, call) => {
  db.dbR.func('cw.get_user_payroll_receipt', params)
    .then(data => {
      db.dbR.end;
      call(data);
    })
    .catch(err => {
      db.dbR.end;
      log.error('get_user_payroll_receipt => ' + err);
      call(false);
    })
}

var jwtService = require('../services/auth');

var get_user_for_test = (id, call) => {
  db.dbW.func('cw.get_user_for_test', id)
    .then(data => {
      if (data.length == 0)
        return call(false);
      db.dbW.end;
      let respuesta = {
        bank_id: data[0].bank_id,
        ingreso_declarado: data[0].ingreso_declarado,
        monthly_payment: data[0].monthly_payment,
        plazo_solicitado: data[0].plazo_solicitado,
        requested_amount: data[0].requested_amount,
        request_id: data[0].id,
        token: ""
      };
      //  data[0].requested_amount.user_id
      db.dbR.func('cw.login_user', [data[0].user_id])
        .then(data2 => {
          respuesta.token = data2[0];
          respuesta.token = jwtService.createToken(respuesta.token);
          call(respuesta);
        })
        .catch(err => {
          log.error('get_user_for_test => login_user => ' + err);
          call(err[0]);
        });
    })
    .catch(err => {
      db.dbW.end;
      log.error('get_user_for_test => ' + err);
      call(false);
    });
}

var set_credit_request_result = (params, call) => {
  db.dbW.func('cw.set_credit_request_result', params)
    .then(data => {
      db.dbW.end;
      return call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('set_credit_request_result => ' + err);
      return call(false);
    });
}

var set_credit_request_approved = (params) => {
  db.dbW.func('cw.set_credit_request_approved', params)
    .then(data => {
      db.dbW.end;
      log.error('OKKKKKKKKKKKKKKKK => ' + data);
    })
    .catch(err => {
      db.dbW.end;
      log.error('set_credit_request_approved => ' + err);
    });
}


module.exports = {
  ADDRESS_BY_CP,
  PERSONAL,
  GET_PERSONAL,
  ADDRESS,
  GET_ADDRESS,
  GET_CATALOGOS,
  get_id_state_by_code,
  get_id_municipality_by_id,
  REFERENCIAS,
  GET_REFERENCIAS,
  save_update_user_payroll_receipt,
  set_user_credit_request,
  get_all_user,
  get_user_data_all,
  get_user_payroll_receipt,

  get_user_for_test,
  set_credit_request_result,
  set_credit_request_approved
};
