'use strict'

//  STATUS  DESCRIPTION
//  1200    service error
//  1100    not information
//  1002    NSS NO VALIDO
//  -2      successful incomplate
//  0       successful

const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

var ocrDA = require('../../psqlDA/ocrDA');

var log = require('log4js').getLogger("OCR SERVICE");

var fs = require('fs');

var dictionary = JSON.parse(fs.readFileSync('./services/ocr/resource/expresiones/0.0.1.json', 'utf8'));


function msg(status, message, data) {
  let response = {};
  response.status = status;
  response.message = message;
  response.data = data;
  return response;
}

var getText = (file, texto) => {
  client
    .textDetection(file)
    .then(results => {
      const detections = results[0].fullTextAnnotation.text;
      texto(true, detections);
    })
    .catch(err => {
      log.fatal("getText => " + err);
      texto(false, err)
    });
};

var TELMEX = text => {
  text = String(text);
  let text_split = text.split('\n');
  let response = { calle: '', cp: '' },
    temp = dictionary.TELMEX.calle;
  temp = dictionary.TELMEX.domicilio;
  for (let i = 0; i < temp.length; i++) {
    let exp = new RegExp(temp[i].exp, temp[i].flag);
    if (exp.test(text)) {
      let arr_cp = text.match(exp);
      if (arr_cp.length > 1) {
        response.cp = arr_cp[1].match(/\d{5}$/)[0];
        break;
      }
      else {
        response.cp = arr_cp[0].match(/\d{5}$/)[0];
        break;
      }
    }
  }
  temp = dictionary.TELMEX.calle;
  for (let i = 0; i < temp.length; i++) {
    let exp = new RegExp(temp[i].exp, temp[i].flag);
    if (exp.test(text)) {
      let arr_cp = text.match(exp);
      response.calle = arr_cp.length > 1 ? arr_cp[1].split('\n')[0] : arr_cp[0].split('\n')[0];
      let clean_street = new RegExp(/\d+/g);
      if (clean_street.test(response.calle)) {
        let temp_num = response.calle.match(clean_street);
        let expe_string = temp_num[temp_num.length-1]+'.+';
        response.calle = response.calle.replace(new RegExp(expe_string, 'g'), '').trim();
      }
    }
  }

  if (response.cp == '' && response.calle == '') return false;
  else return response;
}


var CFE = text => {

  try {
    let response = { calle: '', cp: '' },
      temp = dictionary.CFE.domicilio, domicilio, street = new RegExp(/nombre.+\n.+\n.+\n.+/, 'i');

    if (street.test(text)) {

      let calle_split = text.match(street)[0].split(/\n/),
        calle = calle_split[calle_split.length - 1],
        expNum = new RegExp(/(\w+\s)+((num)|(#)|(s\/n))/, 'i');

      if (expNum.test(calle)) response.calle = calle.match(expNum)[0].replace(/((num)|(#)|(s\/n))/i, '');

      else response.calle = calle;

    }

    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      domicilio = exp.test(text) && text.match(exp).length > 1 ? text.match(exp)[1].match(/.{5}$/ig)[0] : '';

      response.cp = domicilio;
      return response;
    }
  } catch (error) {
    return false;
  }

};


var IZZI = text => {
  let response = { calle: '', cp: '' };
  let temp = dictionary.IZZI.domicilio;
  for (let i = 0; i < temp.length; i++) {
    let exp = new RegExp(temp[i].exp, temp[i].flag);
    let domicilio = exp.test(text) ? text.match(exp)[0].replace(/\n/ig, " ").match(/.{5}$/g)[0] : '';
    response.cp = domicilio;
    return response;
  }
}

var PASAPORTE = (name, call) => {
  getText(name, (flag, aLine) => {
    if (!flag) {
      return call(msg(1200, 'service error'));
    }
    let response = msg(1100, 'not information', {});

    // apellidos
    let temp = dictionary.PASAPORTE.APELLIDOS;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      let apellidos = exp.test(aLine) ? aLine.match(exp)[0].split("\n")[1] : false;
      if (!apellidos) continue;
      response.data.paterno = apellidos.split(" ")[0];
      response.data.materno = apellidos.split(" ")[1];
      response.status = 0;
      response.message = 'successful';
      break;
    }

    //  nombres
    temp = dictionary.PASAPORTE.NOMBRES;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      let nombres = exp.test(aLine) ? aLine.match(exp)[0].split("\n")[1] : false;
      if (!nombres) continue;
      response.data.nombre = nombres;
      response.status = 0;
      response.message = 'successful';
      break;
    }

    // fechas
    temp = dictionary.PASAPORTE.FECHAS;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      let dates = exp.test(aLine) ? aLine.match(exp) : false;
      if (dates != false) {
        if (dates.length == 3) {
          response.data.fecha_nacimiento = dates[0];
          response.data.fecha_expedicion = dates[1];
          response.data.fecha_caducidad = dates[2];
          response.status = 0;
          response.message = 'successful';
          break;
        } else if (dates.length == 2) {
          response.data.fecha_nacimiento = dates[0];
          response.data.fecha_expedicion = dates[1];
          response.status = 0;
          response.message = 'successful';
          break;
        } else if (dates.length == 1) {
          response.data.fecha_nacimiento = dates[0];
          response.status = 0;
          response.message = 'successful';
          break;
        }
      }
    }

    // CURP
    temp = dictionary.PASAPORTE.CURP;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      response.data.curp = exp.test(aLine) ? aLine.match(exp)[0] : false;
      response.status = 0;
      response.message = 'successful';
      break;
    }
    return call(response);
  });
};

var COMRPOBANTE = (name, call) => {
  getText(name, (flag, aLine) => {
    if (!flag) {
      return call(msg(1200, 'service error'));
    }
    if (aLine.match(/(cfe|Comisión Federal)/igm) != null) {
      return call(CFE(aLine));
    } else if (aLine.match(/(telmex|telefonos de mexico)/img) != null) {
      return call(TELMEX(aLine));
    } else if (aLine.match(/(izzi)/img)) {
      return call(IZZI(aLine));
    }
    return call(false);
  });
};

var TARJECT = (name, call) => {
  getText(name, (flag, aLine) => {
    if (!flag) {
      return call({
        status: 1200,
        message: "service error",
        data: {}
      });
    }
    let response;
    let temp = dictionary.TARJECT.numero;
    for (let i = 0; i < temp.length; i++) {
      try {
        let exp = new RegExp(temp[i].exp, temp[i].flag);
        let tarjeta = aLine.match(exp)[0].replace(/[lL]/g, "1")
          .replace(/[oO]/g, "0").replace(/b/g, "6").replace(/\n/gi, "");
        response = msg(0, 'successful', {
          'tarjeta': tarjeta
        });
        break;
      } catch (err) {
        response = msg(1100, 'not information');
      }
    }
    call(response);
  });
};

var FOLIO_FISCAL = (name, call) => {
  getText(name, (flag, aLine) => {
    if (!flag) {
      return call({
        status: 1200,
        message: "service error",
        data: {}
      });
    }
    let response;

    let temp = dictionary.NOMINA.FOLIO_FISCAL;

    for (let i = 0; i < temp.length; i++) {
      try {
        let exp = new RegExp(temp[i].exp, temp[i].flag);
        let folio;
        if (exp.test(aLine)) {
          folio = aLine.match(exp)[0];
          folio = folio.includes("\n") ? folio.split('\n')[1] : folio;
          response = msg(0, "successful", {
            FOLIO_FISCAL: folio
          });
          break;
        } else {
          response = msg(1100, "not information");
        }
      } catch (err) {
        response = msg(1100, "not information");
      }
    }
    call(response);
  });
};


var IFE = (name, call) => {
  getText(name, (flag, aLine) => {

    let response = msg(0, 'successful', {});

    if (!flag) return call(msg(1200, 'service error'));

    let lines = aLine;
    aLine = aLine.replace(/\n/igm, " ");
    let temp = dictionary.INE.curp;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      try {
        let c = aLine.match(exp)[0].replace(/(curp) /i, "");
        response.data.curp = c;
        let c1 = c.match(/^[a-z0]{4}/ig)[0].replace(/0/ig, "O");
        let c2 = c.replace(/^.{4}/ig, "").match(/^[0-9a-z]{6}/ig)[0].replace(/[o]/ig, "0");
        response.data.birthday = `19${c2[0]}${c2[1]}-${c2[2]}${c2[3]}-${c2[4]}${c2[5]}`;
        response.data.rfc = c1 + c2;
        let c3 = c.replace(/^.{10}/g, "").match(/^[a-z0-9]{6}/ig)[0].replace(/[0]/, "O");
        response.data.sexo = c3[0];
        let c4 = c.replace(/.{16}/, "").replace(/[o]/ig, "0");
        exp = new RegExp(/^.\w{2}/, 'ig');
        response.data.estado_nacimiento = exp.test(c3) ? c3.match(exp)[0].replace(/./, '') : '';
        response.data.curp = c1 + c2 + c3 + c4;
        // response.status = 0;
        response.message = "successful";
        break;
      } catch (err) {
        response.status = -2;
        response.message = "not information for CURP";
      }
    }
    temp = dictionary.INE.nombre;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      try {
        let nombre = aLine.match(exp)[0]
          .replace(/( domicilio)/ig, "").replace(/[0]/ig, "O").replace(/(nombre )/ig, "");
        let nombresplit = nombre.split(" ");
        response.data.paterno = nombresplit[0];
        response.data.materno = nombresplit[1];
        response.data.nombre = nombresplit.length == 4 ? nombresplit[2] + " " + nombresplit[3] : nombresplit[2];
        // response.status = 0;
        response.message = "successful";
      } catch (err) {
        response.status = -2;
        response.message = "not information for NAME";
      }
    }
    temp = dictionary.INE.clave;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      try {
        let clave = aLine.match(exp)[0]
          .replace(/(CLAVE DE ELECTOR )/ig, "");
        response.data["clave_electoral"] = clave;
        // response.status = 0;
        response.message = "successful";
      } catch (err) {
        response.status = -2;
        response.message = "information incomplate";
      }
    }
    temp = dictionary.INE.direccion;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      if (exp.test(lines)) {
        let pre_domicilio = lines.match(exp)[0].split("\n");
        let domicilio = {};
        let calle = pre_domicilio[1],
          numero = new RegExp(/\d+/g);
        if (numero.test(calle)) {
          let array = calle.match(numero);
          domicilio.numero = array[array.length - 1];
          domicilio.calle = calle.replace(new RegExp(domicilio.numero, 'g'), '').replace(/\s{2}/g, ' ');
        } else {
          domicilio.numero = 'Escribe tu número';
          domicilio.calle = calle.replace(/^C\s?/i, '');
        }
        let colonia = pre_domicilio[2],
          exp_cp = new RegExp(/\d{5}/g);
        if (exp_cp.test(colonia)) {
          let cp_array = colonia.match(exp_cp);
          domicilio.cp = cp_array[cp_array.length - 1];
          domicilio.colonia = colonia.replace(domicilio.cp, '').replace(/\s{2}/g, ' ').replace(/^COL\s?/i, '');
        }
        let pre_edo_municipio = pre_domicilio[3].replace('.', ''),
          edo_mun_split = pre_edo_municipio.split(',');
        domicilio.municipio = edo_mun_split[0];
        domicilio.edo = edo_mun_split[1];

        response.data["domicilio"] = domicilio;
        // response.status = 0;
        response.message = "successful";
      } else {
        response.status = -2;
        response.message = "information incomplate";
      }
    }

    if (undefined == response.data.estado_nacimiento && response.status == -2) return call(msg(1100, "not information"));
    ocrDA.GET_STATE_BY_CODE(response.data.estado_nacimiento, resp => {

      if (!resp) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
      if (resp == 1200) return res.send(msg(1200, 'T Y P E - D A T A', {}));
      response.data.estado_nacimiento = resp;
      return call(response);
    });
  });
};

var BACK_INE = (name, call) => {
  getText(name, (flag, aLine) => {
    let temp = dictionary.BACK_INE.ID;
    for (let i = 0; i < temp.length; i++) {
      let exp = new RegExp(temp[i].exp, temp[i].flag);
      let folio;
      if (exp.test(aLine)) {
        folio = aLine.match(exp)[0];
        return call(msg(0, "successful", { folio: folio }));
      }
      else {
        return call(msg(2, "not information", { folio: parseInt(Math.random() * 10000000000000) }));
      }
    }
  });
};

var CARTILLA = (name, call) => {
  getText(name, (flag, aLine) => {
    let response = {
      status: 1100,
      message: "not information",
      data: {}
    };
    let NOMBRE = dictionary.CARTILLA.NOMBRE;
    for (let i = 0; i < NOMBRE.length; i++) {
      let exp = new RegExp(NOMBRE[i].exp, NOMBRE[i].flag);
      response.data.nombre = exp.test(aLine) ? aLine.match(exp)[0].replace(/nombre[\s|\.]{0,3}/i, '').replace(/\.+/g, " ") : false;
      if (false != response.data.nombre) {
        response.status = 0;
        response.message = "successful";
      }
    }
    let NACIMIENTO = dictionary.CARTILLA.NACIMIENTO;
    for (let i = 0; i < NACIMIENTO.length; i++) {
      let exp = new RegExp(NACIMIENTO[i].exp, NACIMIENTO[i].flag);
      response.data.fecha_nacimiento = exp.test(aLine) ? aLine.match(exp)[0].replace(/Fecha\s?de\s?nacimiento\s?/i, "").replace(/\.+/g, " ") : false;
      if (false != response.data.fecha_nacimiento) {
        response.status = 0;
        response.message = "successful";
      }
    }
    let PLACE_NACIMIENTO = dictionary.CARTILLA.PLACE_NACIMIENTO;
    for (let i = 0; i < PLACE_NACIMIENTO.length; i++) {
      let exp = new RegExp(PLACE_NACIMIENTO[i].exp, PLACE_NACIMIENTO[i].flag);
      response.data.place_nacimiento = exp.test(aLine) ? aLine.match(exp)[0].replace(/(Naci[ó|o]\s?en\s?)/i, "").replace(/\.+/g, " ") : false;
      if (false != response.data.place_nacimiento) {
        response.status = 0;
        response.message = "successful";
      }
    }
    let DOMICILIO = dictionary.CARTILLA.DOMICILIO;
    for (let i = 0; i < DOMICILIO.length; i++) {
      let exp = new RegExp(DOMICILIO[i].exp, DOMICILIO[i].flag);
      response.data.domicilio = exp.test(aLine) ? aLine.match(exp)[0].replace(/(Domicilio\s?)/i, "").replace(/\.+/g, " ") : false;
      if (false != response.data.domicilio) {
        response.status = 0;
        response.message = "successful";
      }
    }
    let CURP = dictionary.CARTILLA.CURP;
    for (let i = 0; i < CURP.length; i++) {
      let exp = new RegExp(CURP[i].exp, CURP[i].flag);
      response.data.CURP = exp.test(aLine) ? aLine.match(exp)[0].replace(/(Domicilio\s?)/i, "").replace(/\.+/g, " ") : false;
      if (false != response.data.CURP) {
        response.status = 0;
        response.message = "successful";
      }
    }
    call(response);
  });
}

var validateNSS = nss => {
  let firstNum = nss.match(/\d{10}/)[0];
  let totales = [];
  for (let i = 0; i < firstNum.length; i++) {
    let num = parseInt(firstNum.charAt(i));
    if (i % 2 == 0) totales.push(num * 1);
    else totales.push(num * 2);
  }
  let total = 0;
  totales.forEach((e, i) => {
    if (String(e).length == 2) {
      total += parseInt(String(e).charAt(0)) + parseInt(String(e).charAt(1));
    } else {
      total += e;
    }
  });
  return total % 10;
};

var NSS = (name, call) => {
  getText(name, (flag, aLine) => {
    if (!flag) {
      return call({
        status: 1200,
        message: "service error",
        data: {}
      });
    }
    let response = {
      status: 0,
      message: "successful",
      data: {}
    };
    let temp = dictionary.NSS.numero;
    for (let i = 0; i < temp.length; i++) {
      try {
        let exp = new RegExp(temp[i].exp, temp[i].flag);
        let nss = aLine.match(exp)[0].replace(/[lL]/g, "1")
          .replace(/[oO]/g, "0").replace(/b/g, "6").replace(/\s{1}/g, "-");
        if (validateNSS(nss) != nss.match(/\d$/)) {
          response = msg('NSS no valido', 1002, {
            'nss': nss
          });
          break;
        }
        response = msg(0, 'successful', {
          'nss': nss
        });
        break;
      } catch (err) {
        response = msg(1100, "not information");
      }
    }
    call(response);
  });
};

module.exports = {
  IFE,
  BACK_INE,
  COMRPOBANTE,
  TARJECT,
  NSS,
  FOLIO_FISCAL,
  PASAPORTE,
  CARTILLA
};
