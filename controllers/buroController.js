'use strinct'
var fs = require('fs');
var usersrDA = require('../psqlDA/usersrDA');
var buroDA = require('../psqlDA/buroDA');
var requesProcessDA = require('../psqlDA/requesProcessDA');
var dirExample = './exampleBuro/';
var dirExampleDefault =  './exampleBuro/Default.txt';// './exampleBuro/Default.txt';
var buroConfigResponse = './services/buro/responseConfig.json';
var requestBuro = "INTL12                 18941327504MX0000BB115010432Grdx3GUICCMX000000000SP01     0000000PN08SANDOVAL0005BUCIO0209MARGARITA0408131019760513SABM761013KNA0802MX1101S1201F1518SABM761013MDFNCR031602MXPA11LUZ DE LUNA0113RANCHO TETELA0210CUERNAVACA0310CUERNAVACA0403MOR05056216007107771407767ES05003000002**";
var response = {};

function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}

var consult = function(req, res) {
  if (!req.query.id_request_credit) {
    requesProcessDA.set_request_process(req.user.id_user, 8, false, 'missing parameters');
    msg(1000, 'missing parameters', {});
    res.status(200).send(response);
  } else {
    usersrDA.GET_PERSONAL(req.user.id_user, resp => {
      if (!resp[0]) {
        var buro;
        var RFC = resp.rfc + '.txt';
        if (!fs.existsSync(dirExample + RFC)) {
          buro = fs.readFileSync(dirExampleDefault, 'utf8');
        } else {
          buro = fs.readFileSync(dirExample + RFC, 'utf8');
        }

        var respBuro = responseBuro(buro);

        var AuxInsert = {};
        AuxInsert.id_request_credit = req.query.id_request_credit;
        AuxInsert.request_buro = requestBuro;
        AuxInsert.id_response_buro = respBuro.ES.NoControlCon;
        AuxInsert.response_buro = buro;

        buroDA.set_request_buro(AuxInsert, (respSet) => {

          if (respSet.status == 0) {
            requesProcessDA.set_request_process(req.user.id_user, 8, true, 'Successful');
            msg(0, 'Successful', respBuro);
            res.status(200).send(response);
          }else {
            requesProcessDA.set_request_process(req.user.id_user, 8, false, 'Error, try later');
            msg(1001, 'Error, try later', {});
            res.status(200).send(response);
          }
        });

      } else {
        msg(1001, 'Not data', {});
        res.status(200).send(response);
      }

    });

  }
};


const responseBuro = (buro) => {
  var resp = {};
  var AUXOBJ = {};
  var AUXOBJARRAY = [];
  var responseConfig = JSON.parse(fs.readFileSync(buroConfigResponse));
  var j = 0;
  var l = buro.length;
  // var n = 0;
  var key = "";
  var KeySe = "";
  while (j < l - 2) {
    if (j <= 48) {
      var objKeysHEAD = Object.keys(responseConfig.HEAD);
      var objValuesHEAD = Object.values(responseConfig.HEAD);
      for (let i = 0; i < objKeysHEAD.length; i++) {
        resp[objKeysHEAD[i]] = buro.substring(j, objValuesHEAD[i] + j);
        j += objValuesHEAD[i];
      }
      j = 49;
    }
    key = buro.substring(j, j + 2);
    if (isNaN(key)) {
      if (KeySe != "") { //&& key == "PA"

        if (KeySe != key && KeySe != "PA" && KeySe != "PE" && KeySe != "TL" && KeySe != "IQ" && KeySe != "RS" && KeySe != "HI" && KeySe != "HR" && KeySe != "SC") {
          resp[KeySe] = AUXOBJ;

        } else if (KeySe == 'PA' || KeySe == "PE" || KeySe == "TL" || KeySe == "IQ" || KeySe == "RS" || KeySe == "HI" || KeySe == "HR" || KeySe == "SC") {
          AUXOBJARRAY.push(
            AUXOBJ
          );
        }
        if (KeySe != key && (KeySe == "PA" || KeySe == "PE" || KeySe == "TL" || KeySe == "IQ" || KeySe == "RS" || KeySe == "HI" || KeySe == "HR" || KeySe == "SC")) {
          resp[KeySe] = AUXOBJARRAY;
          AUXOBJARRAY = [];
        }
      }
      KeySe = key;

      AUXOBJ = {};
      j += 2;
      rango = parseInt(buro.substring(j, j + 2));
      j += 2;
      rango += j;
      AUXOBJ[responseConfig[KeySe][key]] = buro.substring(j, rango);
      j = rango;
    } else {
      j += 2;
      rango = parseInt(buro.substring(j, j + 2));
      j += 2;
      rango += j;
      AUXOBJ[responseConfig[KeySe][key]] = buro.substring(j, rango);
      if (buro.substring(j, rango) == "**") {
        resp[KeySe] = AUXOBJ;
      }
      j = rango;
    }
  }
  return resp;
}



module.exports = {
  consult
};
