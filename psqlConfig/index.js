'use strict'
var pgp =  require("pg-promise")({});
const connPsqlAdmin = {
  host: 'ip',
  port: 1234,
  database: 'dbname',
  user: 'usernameAdmin',
  password: 'username123'
};

const connPsqlRead = {
  host: 'ip',
  port: 1234,
  database: 'dbname',
  user: 'usernameRead',
  password: 'username123'
};
const connPsqlWrite = {
  host: 'ip',
  port: 1234,
  database: 'dbname',
  user: 'usernameWrite',
  password: 'username123'
};

var  dbA = pgp(connPsqlAdmin);
var  dbR = pgp(connPsqlRead);
var  dbW = pgp(connPsqlWrite);



module.exports = {
  dbA,
  dbR,
  dbW
}
