'use strict'


var log = require('log4js').getLogger("IMSS CONTROLLER");
var requesterService = require('../services/requester/index');

var imssDA = require('../psqlDA/imss');

function msg(status, message, data) {
    let response = {};
    response.status = status;
    response.message = message;
    response.data = data;
    return response;
}

function missingParams() {
    return {
        status: 1000,
        message: "missing parameters"
    };
}

/*    R E S P O N S E
1000  =>  missing parameters
1200  =>  Error de datos
1300  =>  Similitud de rostros no encontrada
1400  =>  SERVICIO NO DISPONIBLE
0     =>  Successful
*/
exports.COMPARACION_FACIAL = (req, res) => {
    if (!req.body.credencial || !req.body.captura || !req.body.tipo) return res.send(missingParams());
    requesterService.request_reconocimiento_facial(req.body, 'username', '1234', respuesta => {
        if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Error de datos') {
            res.send(msg(1200, 'Error de datos'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Similitud de rostros no encontrada') {
            res.send(msg(1300, 'Similitud de rostros no encontrada'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Error de autenticacion') {
            log.error(respuesta.estatus + ' - COMPARACION_FACIAL  => ' + respuesta.mensaje);
            res.send(msg(1400, 'SERVICIO NO DISPONIBLE'));
        }
        else {
            res.send(msg(0, 'Successful', respuesta.Similitud));
        }
    });
};

/*    R E S P O N S E
1000  =>  missing parameters
1200  =>  Datos incorrectos o inexistentes
1300  =>  No esta vigente como medio de identificacion y no puede votar
1400  =>  CIC con formato no valido
1500  =>  “OCR con formato no valido
1600  =>  Clave de elector con formato no valido
1700  =>  Numero de emision con formato no valido
1800  =>  Error de datos
1900  =>  SERVICIO NO DISPONIBLE
0     =>  Successful
*/
exports.VALIDACIO_INE_IFE = (req, res) => {
    if (!req.body.cic || !req.body.ocr || !req.body.claveElector || !req.body.numeroEmision) return res.send(missingParams());
    requesterService.request_validacion_ine_ife(req.body, 'atreva', 'YXRyZXZhOl9IanNlLkVXUng=', respuesta => {
        if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Datos incorrectos o inexistentes') {
            res.send(msg(1200, 'Datos incorrectos o inexistentes'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'No esta vigente como medio de identificacion y no puede votar') {
            res.send(msg(1300, 'No esta vigente como medio de identificacion y no puede votar'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'CIC con formato no valido') {
            res.send(msg(1400, 'CIC con formato no valido'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == '“OCR con formato no valido') {
            res.send(msg(1500, '“OCR con formato no valido'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Clave de elector con formato no valido') {
            res.send(msg(1600, 'Clave de elector con formato no valido'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Numero de emision con formato no valido') {
            res.send(msg(1700, 'Numero de emision con formato no valido'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Error de datos') {
            res.send(msg(1800, 'Error de datos'));
        }
        else if (respuesta.estatus == 'ERROR' && respuesta.mensaje == 'Error de autenticacion') {
            log.error(respuesta.estatus + ' - VALIDACIO_INE_IFE  => ' + respuesta.mensaje);
            res.send(msg(1900, 'SERVICIO NO DISPONIBLE'));
        }
        else if (respuesta.estatus == 'OK' && respuesta.claveMensaje == 3) {
            //Esta vigente como medio de identificacion y puede votar
            res.send(msg(0, 'Successful', respuesta.mensaje));
        }
        else if (respuesta.estatus == 'OK' && respuesta.claveMensaje == 2) {
            //Esta vigente como medio de identificacion y no puede votar
            res.send(msg(0, 'Successful', respuesta.mensaje));
        }
    });
};


/**
 *  SERVICIO PARA EL FLUJO DE IMSS DONDE REGISTRA DATOS DE SUS PAGOS, GENERO Y ESTADO CIVIL
 *  0        =>  Successful
 *  1200     =>  datos incorrectos con el imss
 */
exports.set_imss_deposit = (req, res) => {
    if (!req.body.nss || !req.body.bruto || !req.body.last_deposit || !req.body.civil_status || !req.body.gender) return res.send(missingParams());
    imssDA.set_imss_deposit([req.user.id_user, req.body.nss, req.body.bruto, req.body.last_deposit, req.body.civil_status, req.body.gender], response => {
        if (!response) return res.send(msg(5000, 'E R R O R - G E N E R A L', {}));
        if (response.status == 'SAVED' || response.status == 'UPDATE') return res.send(msg(0, 'Successful'));
        else res.send(msg(0, 'error SQL', response));
    });
};