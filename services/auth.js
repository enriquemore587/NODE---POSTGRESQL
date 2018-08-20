'use strict'

var jwt = require('jwt-simple');

var moment = require('moment');

var secret = 'clave_secreta_para_cifrar';

exports.createToken = user => {
  user.iat = moment().unix();
  user.exp = moment().add(30, 'days').unix();
  return jwt.encode(user, secret);
}
