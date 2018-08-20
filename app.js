'use strict'

var log4js = require('log4js');

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var log = log4js.getLogger("app");

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

//app.use(bodyParser.urlencoded({extend:false}));

app.use(bodyParser.json());

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();

});



var sessionRoute = require('./routes/sesionsRoute');

var documentRoute = require('./routes/documentRoute');

var ocrRoute = require('./routes/ocrRoute');

var usersRoute = require('./routes/usersRoute');

var comparativeRoute = require('./routes/comparativeEntitiesRoute');

var banksBinRoute = require('./routes/banksBinRoute');

var validateRoute = require('./routes/validateRoute');

var usersBankRoute = require('./routes/usersBankRoute');

var buroRoute = require('./routes/buroRoute');

var requestProcessRoute = require('./routes/requestProcessRoute');

var imssRoute = require('./routes/imssRoute');

var adminRoute = require('./routes/adminOneRoute');

var ejecutivosRoute = require('./routes/ejecutivosRoute');


var directorRoute = require('./routes/directorRoute');


var AdminBankRoute = require('./routes/AdminBankRoute');


app.use('/credi-where/session', sessionRoute);

app.use('/credi-where/document', documentRoute);
// actualizacion OCR crediwhere 0.0.1v
app.use('/credi-where/ocr', ocrRoute);
// actualizacion complete information crediwhere 0.0.1v
app.use('/credi-where/users', usersRoute);

app.use('/credi-where/entities', comparativeRoute);

app.use('/credi-where/bankBin', banksBinRoute);

app.use('/credi-where/validate', validateRoute);

app.use('/credi-where/usersBank', usersBankRoute);

app.use('/credi-where/buro', buroRoute);

app.use('/credi-where/requestProcess', requestProcessRoute);

app.use('/credi-where/imss', imssRoute);

app.use('/credi-where/admin', adminRoute);

app.use('/credi-where/ejecutivo', ejecutivosRoute);

app.use('/credi-where/direccion', directorRoute);

app.use('/credi-where/admin-bank', AdminBankRoute);


module.exports = app;
