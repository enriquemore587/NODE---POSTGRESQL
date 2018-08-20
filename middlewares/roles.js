'use strict'

var jwt = require('jwt-simple');

var moment = require('moment');

var secret = 'clave_secreta_para_cifrar';

var isAdmin = (req, res, next) => {
  console.log(req.user.id_profile);
  if (req.user.id_profile != 1) {
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> SOLO ADMIN << TU ERES '+req.user.name_profile});
  }
  next();
};

var isAllAdmin = (req, res, next) => {
  if (req.user.id_profile != 1 || req.user.id_profile != 2) {
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> SOLO ADMIN O AdminWeb << TU ERES '+req.user.name_profile});
  }
  next();
};

var isAdminWeb = (req, res, next) => {
  if (req.user.id_profile != 2) {
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> SOLO ADMIN WEB << TU ERES '+req.user.name_profile});
  }
  next();
};

var isEndUser = (req, res, next) => {
  if (req.user.id_profile != 3) {
    
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> USUARIOS FINALES << TU ERES '+req.user.name_profile});
  }
  next();
};

var isBankUser = (req, res, next) => {
  if (req.user.id_profile != 4) {
    
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> USUARIO BANCO << TU ERES '+req.user.name_profile});
  }
  next();
};

var isEjecutivo = (req, res, next) => {
  if (req.user.id_profile != 5) {
    
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> EJECUTIVO BANCO << TU ERES '+req.user.name_profile});
  }
  next();
};

var isDirector = (req, res, next) => {
  if (req.user.id_profile != 6) {
    
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> DIRECTOR DE BANCO << TU ERES '+req.user.name_profile});
  }
  next();
};

var isAdminBanco = (req, res, next) => {
  if (req.user.id_profile != 7) 
    return res.send({status: 3000, message: 'NO TIENES ACCESO PARA ESTE SERVICIO >> ADMINISTRADOR BANCO << TU ERES '+req.user.name_profile});
  next();
};

module.exports = {
  isAdmin,
  isAllAdmin,
  isAdminWeb,
  isEndUser,
  isBankUser,
  isEjecutivo,
  isDirector,
  isAdminBanco
};
