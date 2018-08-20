'use strict'

//  STATUS  DESCRIPTION
//  1000    missing parameters
//  1200    service error
//  1100    information not found
//  1002    NSS NO VALIDO
//  -2      successful incomplate
//  0       successful

// var ocrService = require('../services/ocr/');

var fs = require('fs');
var log = require('log4js').getLogger("ADMIN CONTROLLER");

var adminDA = require('../psqlDA/adminDA');

var requesProcessDA = require('../psqlDA/requesProcessDA');

var fs = require('fs');
var path = require('path');

function missingParams() {
    return {
        status: 1000,
        message: "missing parameters"
    };
}
function msg(status, message, data) {
    let response = {};
    response.status = status;
    response.message = message;
    response.data = data;
    return response;
}

exports.get_users_list = (req, res) => {
    adminDA.get_users_list([], (usuarios) => {
        res.send({ 'usuarios': usuarios });
    });
}

exports.get_general_information_user = (req, res) => {
    adminDA.get_general_information_user([req.query.user_id], (generalinformation) => {
        res.send(msg(0, 'successful', generalinformation));
    });
}


exports.getImageFile = (req, res) => {
    var imageFile = req.query.imageFile;
    var path_file = imageFile.replace(/\\/g,'/');
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'LA IMAGEN NO EXISTE' });
        }
    });
}


exports.getImageFile2 = (req, res) => {
    var imageFile = req.body.imageFile;
    var path_file = imageFile.replace(/\\/g,'/');
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'LA IMAGEN NO EXISTE' });
        }
    });
}


exports.get_locations_by_user_success = (req, res) => {
    adminDA.get_locations_by_user_success([req.query.user_id, req.query.success], (locations) => {
        res.send(locations);
    });
}