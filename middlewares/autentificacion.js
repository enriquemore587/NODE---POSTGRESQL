'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave_secreta_para_cifrar';

exports.ensureAuth = (req, res, next) => {

  if (!req.headers.authorization) {
    return res.send({status: 2000, message: "PETICIÓN SIN AUTENTIFICACIÓN"});
  }
  var token = req.headers.authorization.replace(/['"]+/g,'');
  req.token = token;
  try {
    var pyload = jwt.decode(token, secret);
  } catch (err) {
    return res.send({status: 2001, message: "TOKEN NO VALIDO"});
  }
  req.user = pyload;
  
  next();
};
