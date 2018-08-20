var express =  require('express');

var api = express.Router();

var sessionController = require('../controllers/sessionController');

var autentificacion = require('../middlewares/autentificacion');

var rol = require('../middlewares/roles');

api.post('/register', sessionController.register); //, [autentificacion.ensureAuth, rol.isEndUser]
api.post('/login', sessionController.login);
api.get('/accAct', sessionController.account_activation);
api.get('/codeForwarding', sessionController.code_forwarding);
api.get('/forgotPwd',sessionController.forgot_pwd );
api.get('/chagePwd',autentificacion.ensureAuth,  sessionController.change_pwd );

api.post('/login-bank', sessionController.loginUserBank);

module.exports =  api;
