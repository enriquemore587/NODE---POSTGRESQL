const fs = require('fs');
const request = require('request');

const url = "http://127.0.0.1:3789/credi-where/",
    urlIMSS = "https://ine.nubarium.com/";
var log = require('log4js').getLogger("requester/index.js");

exports.REQUES_BURO = (obj, token, call) => {
    request.get({
        url: url + 'buro/consult?id_request_credit=enrrique',
        headers: {
            "Authorization": token
        },
        form: obj
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            log.error('REQUES_BURO => ' + err);
            return call(false);
        }
        else call(JSON.parse(body));
    });
}


exports.get_icc_bank_motor = (obj, token, call) => {
    request.get({
        url: url + 'users/get-icc-bank-motor?icc=' + obj.icc + '&id_bank=' + obj.id_bank,
        headers: {
            "Authorization": token
        }
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            log.error('get_icc_bank_motor => ' + err);
            return call(false, err);
        }
        else return call(JSON.parse(body));
    });
}

exports.request_test = (obj, call) => {
    request.post({
        url: url + 'ocr/ine-bot',
        formData: formData
    }, function optionalCallback(err, httpResponse, body) {
        fs.unlinkSync('./services/resource/' + name);
        if (err) {
            log.error('request_test => ' + err);
            call(false, err);
        }
        else call(body);
    });
}


exports.request_reconocimiento_facial = (obj, user, password, call) => {
    var auth = "Basic " + new Buffer(user + ":" + password).toString("base64");
    request.post({
        url: urlIMSS + 'antifraude/reconocimiento_facial',
        headers: {
            "Authorization": auth
        },
        form: obj
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            log.error('request_reconocimiento_facial => ' + err);
            call(false, err);
        }
        else call(JSON.parse(body));
    });
}



exports.request_validacion_ine_ife = (obj, user, password, call) => {
    var auth = "Basic " + new Buffer(user + ":" + password).toString("base64");
    request.post({
        url: urlIMSS + 'ine/valida_ine',
        headers: {
            "Authorization": auth
        },
        form: obj
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            log.error('request_validacion_ine_ife => ' + err);
            call(false, err);
        }
        else call(JSON.parse(body));
    });
}


