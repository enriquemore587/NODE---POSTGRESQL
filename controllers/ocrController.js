'use strict'

//  STATUS  DESCRIPTION
//  1000    missing parameters
//  1200    service error
//  1100    information not found
//  1002    NSS NO VALIDO
//  -2      successful incomplate
//  0       successful

var ocrService = require('../services/ocr/');

var fs = require('fs');
var log = require('log4js').getLogger("OCR CONTROLLER");

var ocrDA = require('../psqlDA/ocrDA');

var requesProcessDA = require('../psqlDA/requesProcessDA');

function missingParams() {
  return {
    status: 1000,
    message: "missing parameters"
  };
}
function msgErrorUUID() {
  return {
    status: 8000,
    message: "invalid input syntax for uuid"
  };
}


exports.INE_BOT = (req, res) => {
  var id_user = '';
  var temporalToken = '';
  if (req.user) {                                                                                                   // esta autenticado ???
    temporalToken = req.user.id_user;
    id_user = req.user.id_user;
  } else {                                                                                                          // como no estas autenticado necesitas de temporalToken
    if (!req.body.temporalToken) return res.send(missingParams());
    else {
      temporalToken = req.body.temporalToken;
      id_user = req.body.temporalToken;
    }
  }

  if (!req.files.foto) {
    requesProcessDA.set_request_process(id_user, 2, false, 'missing parameters');
    return res.send(missingParams());
  }


  var file_path = req.files.foto.path;
  ocrService.IFE(file_path, response => {
    if (response.status == -2) {
      ocrDA.set_a_ocr_file([1, file_path, false, temporalToken], resp_ocr => { 
        if (resp_ocr.status != 0) {
          log.error(`INE_BOT (not information) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        }
        else {
          return res.send(response);
        }
      });
      //log.error(`INE_BOT -> NO SE LEYÓ LA INFORMACIÓN COMPLETA IMAGEN: ${file_path}`);

    }
    if (response.status == 1100) {
      ocrDA.set_a_ocr_file([1, file_path, false, temporalToken], resp_ocr => {
        if (resp_ocr.status != 0) {
          log.error(`INE_BOT (not information) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        } else {
          //log.error(`INE_BOT -> NO SE LEYÓ estado_nacimiento IMAGEN: ${file_path}`);
          return res.send(response);
        }
      });
    }

    ocrDA.set_a_ocr_file([1, file_path, true, temporalToken], resp_ocr => {
      if (resp_ocr.status != 0) {
        log.error(`INE_BOT (successful) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
        return res.send(msgErrorUUID());
      }
      if (resp_ocr.ruta != 'no rute') deleteFile(resp_ocr.ruta);
      res.send(response);
    });
  });
};

exports.BACK_INE = (req, res) => {

  var id_user = '';
  var temporalToken = '';
  if (req.user) {                                                                                                   // esta autenticado ???
    temporalToken = req.user.id_user;
    id_user = req.user.id_user;
  } else {                                                                                                          // como no estas autenticado necesitas de temporalToken
    if (!req.body.temporalToken) return res.send(missingParams());
    else {
      temporalToken = req.body.temporalToken;
      id_user = req.body.temporalToken;
    }
  }

  if (!req.files.foto) return res.send({
    status: 1000,
    message: "missing parameters",
    data: {}
  });


  var file_path = req.files.foto.path;

  ocrService.BACK_INE(file_path, response => {

    if (response.status != 0) {

      ocrDA.set_a_ocr_file([2, file_path, false, temporalToken], resp_ocr => {
        if (resp_ocr.status != 0) {
          log.error(`BACK_INE (not information) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        }
        //log.error(`BACK_INE -> NO SE DETECTO FOLIO CORRECTAMENTE IMAGEN => ${file_path}`);
        return res.send(response);
      });

    }

    ocrDA.set_a_ocr_file([2, file_path, true, temporalToken], resp_ocr => {
      if (resp_ocr.status != 0) {
        log.error(`BACK_INE (successful) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
        return res.send(msgErrorUUID());
      }
      if (resp_ocr.ruta != 'no rute') deleteFile(resp_ocr.ruta);
      res.send(response);
    });
  });
};


exports.FOLIO_FISCAL = (req, res) => {


  var id_user = '';
  var temporalToken = '';
  if (req.user) {                                                                                                   // esta autenticado ???
    temporalToken = req.user.id_user;
    id_user = req.user.id_user;
  } else {                                                                                                          // como no estas autenticado necesitas de temporalToken
    if (!req.body.temporalToken) return res.send(missingParams());
    else {
      temporalToken = req.body.temporalToken;
      id_user = req.body.temporalToken;
    }
  }

  if (!req.files.foto) {
    requesProcessDA.set_request_process(id_user, 5, false, 'missing parameters');
    return res.send(missingParams());
  }

  var file_path = req.files.foto.path;
  ocrService.FOLIO_FISCAL(file_path, response => {

    if (response.status == 0) {
      ocrDA.set_a_ocr_file([4, file_path, true, temporalToken], resp_ocr => {
        if (resp_ocr.status != 0) {
          log.error(`FOLIO_FISCAL (successful) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        }
        if (resp_ocr.ruta != 'no rute') deleteFile(resp_ocr.ruta);
        return res.send(response);
      });
    }
    else {
      ocrDA.set_a_ocr_file([4, file_path, false, temporalToken], resp_ocr => {
        if (resp_ocr.status != 0) {
          log.error(`FOLIO_FISCAL (not information) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        }
        return res.send(response);
      });
    }
  });
};

exports.COMPROBANTES = (req, res) => {
  var id_user = '';
  var temporalToken = '';
  if (req.user) {                                                                                                   // esta autenticado ???
    temporalToken = req.user.id_user;
    id_user = req.user.id_user;
  } else {                                                                                                          // como no estas autenticado necesitas de temporalToken
    if (!req.body.temporalToken) return res.send(missingParams());
    else {
      temporalToken = req.body.temporalToken;
      id_user = req.body.temporalToken;
    }
  }


  if (!req.files.foto) {
    requesProcessDA.set_request_process(id_user, 4, false, 'missing parameters');
    return res.send(missingParams());
  }



  var file_path = req.files.foto.path;
  ocrService.COMRPOBANTE(file_path, response => {
    if (!response) {
      requesProcessDA.set_request_process(id_user, 4, false, 'bad resoloution');
      ocrDA.set_a_ocr_file([3, file_path, false, temporalToken], resp_ocr => {
        if (resp_ocr.status != 0) {
          log.error(`COMPROBANTES (bad resoloution) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        }
        return res.send({
          status: 1001,
          message: 'bad resoloution'
        });
      });
    }
    ocrDA.ADDRESS_BY_CP(response.cp, resp => {
      if (!resp) {
        ocrDA.set_a_ocr_file([3, file_path, false, temporalToken], resp_ocr => {
          if (resp_ocr.status != 0) {
            log.error(`COMPROBANTES (not information) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
            return res.send(msgErrorUUID());
          }
          requesProcessDA.set_request_process(id_user, 4, false, 'not information');
          return res.send({
            status: 0,
            message: "not information",
            data: {
              cp: response
            }
          });
        });
      }

      resp.calle = response.calle;
      requesProcessDA.set_request_process(id_user, 4, true, 'successful');
      ocrDA.set_a_ocr_file([3, file_path, true, temporalToken], resp_ocr => {
        if (resp_ocr.status != 0) {
          log.error(`COMPROBANTES (successful) -> REGISTRO NO EXITOSO EN BD: ${file_path}`);
          return res.send(msgErrorUUID());
        }
        if (resp_ocr.ruta != 'no rute') deleteFile(resp_ocr.ruta);
        return res.send({ status: 0, message: "successful", data: resp });
      });
    });
  });
};


exports.TARJECT = (req, res) => {
  if (!req.files) return res.send({
    status: 1000,
    message: "missing parameters",
    data: {}
  });
  var file_path = req.files.foto.path;
  ocrService.TARJECT(file_path, response => {
    fs.unlink(file_path, err => {
      if (err) {
        log.error(".  : FILE NOT DELETED < TARJECT >:  .");
        return res.send(response);
      }
      return res.send(response);
    })
  });
};


exports.NSS = (req, res) => {
  if (!req.files) return res.send({
    status: 1000,
    message: "missing parameters",
    data: {}
  });
  var file_path = req.files.foto.path;
  ocrService.NSS(file_path, response => {
    fs.unlink(file_path, err => {
      if (err) {
        log.error(".  : FILE NOT DELETED < NSS >:  .");
        return res.send(response);
      }
      return res.send(response);
    })
  });
};

exports.PASAPORTE = (req, res) => {
  if (!req.files.foto) {
    requesProcessDA.set_request_process(req.user.id_user, 3, false, 'missing parameters');
    return res.send({
      status: 1000,
      message: "missing parameters",
      data: {}
    });
  }
  var file_path = req.files.foto.path;
  ocrService.PASAPORTE(file_path, response => {
    fs.unlink(file_path, err => {
      if (err) {
        log.error(".  : FILE NOT DELETED < P A S A P O R T E >:  .");
        requesProcessDA.set_request_process(req.user.id_user, 3, false, '.  : FILE NOT DELETED < INE >:  .');
        return res.send(response);
      } else {
        requesProcessDA.set_request_process(req.user.id_user, 3, true, 'successful');
      }
      return res.send(response);
    })
  });
};


exports.CARTILLA = (req, res) => {
  if (!req.files) return res.send({
    status: 1000,
    message: "missing parameters",
    data: {}
  });
  var file_path = req.files.foto.path;
  ocrService.CARTILLA(file_path, response => {
    if (!response) return res.send({
      status: 1001,
      message: 'bad resoloution'
    });
    fs.unlink(file_path, err => {
      if (err) {
        log.error("ocrService.CARTILLA => " + err);
        return res.send(response);
      };
      res.send(response);
    });
  });
}


exports.INE_SAVE = (req, res) => {
  var file_path = req.files.foto.path;
  let response = {
    status: 0,
    message: "successful",
    data: {}
  };
  fs.exists(file_path, exists => {
    response.data.fileName = file_path.split('\\')[4].replace(/\.[\w]+/, "");
    if (exists) return res.send(response);
    response.status = 1001;
    response.message = "INFORMATION NOT KEPT";
    return res.send(response);
  });
};

exports.COMPROBANTES_SAVE = (req, res) => {
  var file_path = req.files.foto.path;
  let response = {
    status: 0,
    message: "successful",
    data: {}
  };
  fs.exists(file_path, exists => {
    response.data.fileName = file_path.split('\\')[4].replace(/\.[\w]+/, "");
    if (exists) return res.send(response);
    response.status = 1001;
    response.message = "INFORMATION NOT KEPT";
    return res.send(response);
  });
};

exports.TARJECT_SAVE = (req, res) => {
  var file_path = req.files.foto.path;
  let response = {
    status: 0,
    message: "successful",
    data: {}
  };
  fs.exists(file_path, exists => {
    response.data.fileName = file_path.split('\\')[4].replace(/\.[\w]+/, "");
    if (exists) return res.send(response);
    response.status = 1001;
    response.message = "INFORMATION NOT KEPT";
    return res.send(response);
  });
};

exports.NSS_SAVE = (req, res) => {
  var file_path = req.files.foto.path;
  let response = {
    status: 0,
    message: "successful",
    data: {}
  };
  fs.exists(file_path, exists => {
    response.data.fileName = file_path.split('\\')[4].replace(/\.[\w]+/, "");
    if (exists) return res.send(response);
    response.status = 1001;
    response.message = "INFORMATION NOT KEPT";
    return res.send(response);
  });
};

var deleteFile = file_path => {
  fs.unlink(file_path, err => {
    if (err) {
      log.error(`FILE NOT DELETED < ${file_path} >`);
      requesProcessDA.set_request_process(id_user, 4, false, `.  : FILE NOT DELETED < ${file_path} >:  .`);
    }
  });
}