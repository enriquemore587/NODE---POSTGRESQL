'use strict'

var pgp = require("pg-promise")({});

const db = require("../psqlConfig");

var log = require('log4js').getLogger("USUARIOS OCR - DA");

var GET_STATE_BY_CODE = (params, call) => {
  db.dbR.func('cw.get_state_by_clave', [params])
    .then(data => {
      db.dbW.end;
      call(data[0]);
    })
    .catch(err => {
      db.dbW.end;
      log.error('GET_STATE_BY_CODE (get_state_by_clave) => ' + error);
      call(false);
    })
};

var ADDRESS_BY_CP = function(cp, call) {
  db.dbR.func('cw.getcatsbycp', [cp])
    .then(data => {
      db.dbR.end;
      if (data.length > 0) {
        let temp = {
          cp: cp,
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
      }else{
        call(false);
      }
    })
    .catch(error => {
      log.error('ADDRESS_BY_CP (getcatsbycp) => ' + error);
      db.dbR.end;
      call(false);
    });
};

var set_a_ocr_file = (params, call) => {    
  console.log("params", params);
  log.error('<= NO ES ERROR => ');
  log.error(params);
  log.error('<= END NO ES ERROR => ');
  db.dbW.func('cw.set_a_ocr_file', params)
      .then(data => {
          db.dbW.end;
          call(data[0]);
      })
      .catch(err => {
          db.dbW.end;
          log.error('set_a_ocr_file => ' + err);
          log.error(err);
          call(false);
      })
}

module.exports = {
  GET_STATE_BY_CODE,
  ADDRESS_BY_CP,
  set_a_ocr_file
};
