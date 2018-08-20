'use strict'

/*    R E S P O N S E
1000  =>  missing parameters
5000  =>  E R R O R - G E N E R A L
1200  =>  {T Y P E - D A T A}
1100  =>  U S U A R  I O - N O - E X I S T E
0     =>  successful    || no information
*/

var ejecutivoDA = require('../psqlDA/directorDA');
var log = require('log4js').getLogger("EJECUTIVO CONTROLLER");
var fs = require('fs');



Array.prototype.unique = function (a) {
    return function () {
        return this.filter(a)
    }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});


function msg(status, message, data) {
    return {
        status: status,
        message: message,
        data: data
    }
}

function missingParams() {
    return {
        status: 1000,
        message: "missing parameters"
    };
}


exports.get_user_for_formaliza = (req, res) => {
    let a = req.user.id_bank;//id_user;
    ejecutivoDA.get_user_for_formaliza([req.query.valor, req.query.search_mode, req.user.id_bank], resp1 => {
        if (!resp1.data_user) return res.send(msg(0, 'no information', {}));
        return res.send(msg(0, 'successful', resp1.data_user));
    });
}

exports.getImageFile = (req, res) => {
    var imageFile = req.query.imageFile;
    var path_file = imageFile;
    fs.exists(path_file, function (exists) {
        if (exists)
            res.sendFile(path.resolve(path_file));
        else
            res.status(404).send({ message: 'LA IMAGEN NO EXISTE' });
    });
}