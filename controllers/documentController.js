'use strinct'
var fs = require('fs');

var multiparty = require('multiparty');

//var pdf = require('pdf-poppler');

var path = require('path');

var response = {};
 //Enrique prueba
function msg(status, message, data) {
  response.status = status;
  response.message = message;
  response.data = data;
}

var typeDocument = [{
  type: 0,
  name: 'IFE'
}, {
  type: 1,
  name: 'COMPROBANTE'
}];


var dirTemp = './tempFile/';
var dirUserFiles = './zip/';



var addDocument = function(req, res) {
  var form = new multiparty.Form({
    uploadDir: dirTemp
  });
  form.parse(req, function(err, fields, files) {
    if (!fields.type[0] || !files.file) {
      msg(1000, 'missing parameters', {});
      res.status(200).send(response);
    } else {
      //Identifica el type y asigna a la variable typeName el typo de  nombre al documento (IFE, COMPROBANTE)
      var typeName = "";
      for (var i = 0; i < typeDocument.length; i++) {
        if (parseInt(fields.type[0]) == typeDocument[i].type) {
          typeName = typeDocument[i].name;
        }
      }
      //Path del archivo temporal
      var pathTem = files.file[0].path;
      // Dependencia para generar el archivo zip
      var zip = new require('node-zip')();
      //Extrae la extencion del archivo
      var fileExtension = (pathTem.split(".")[1]);
      //Asigna el nombre del archico a guardad(id_user+ typename + extencion del archivo)
      var namefile = req.user.id_user + "-" + typeName + "." + fileExtension;
      //Especifica el directorio final del usuario para el guardado del archivo zip (dirUserFiles['./zip/'] + id_user)
      var dirUser = dirUserFiles + req.user.id_user;
      //Especifia  el nombre del archivo zip, y la ruta donde se guardara (dirUser)
      var dirUserFileZip = dirUser + "/" + (namefile.split("."))[0] + '.zip';
      //Determina si el directorio se encuentra creado.. en caso de no existir lo crea.
      if (!fs.existsSync(dirUser)) {
        fs.mkdirSync(dirUser);
      }

      if (fileExtension == 'pdf' || fileExtension == 'PDF') {
        var nameTmpFile = dirTemp + (pathTem.split("\\"))[1];
        var nameFileJPG = (namefile.split("."))[0];
        var opts = {
          format: 'jpeg',
          out_dir: path.dirname(nameTmpFile),
          out_prefix: nameFileJPG,
          page: 1
        }
        var dirJPGUser = dirTemp + nameFileJPG + '-1.jpg';
        pdf.convert(nameTmpFile, opts).then(res => {
          //perapara el archivo JPG Generado del PDF
          zip.file(nameFileJPG + '.jpg', fs.readFileSync(dirJPGUser));
          //prepara  el archivo  y cambio nombre por el namefile, para egregar al zip
          zip.file(namefile, fs.readFileSync(pathTem));
          //Genera el archivo zip temp
          var data = zip.generate({
            base64: false,
            compression: 'DEFLATE'
          });
          // Crea el archivo generado en el directorio final
          fs.writeFileSync(dirUserFileZip, data, 'binary');
          fs.unlinkSync(pathTem);
          fs.unlinkSync(dirJPGUser);
        });

      } else {
        //prepara  el archivo  y cambio nombre por el namefile, para egregar al zip
        zip.file(namefile, fs.readFileSync(pathTem));
        //Genera el archivo zip temp
        var data = zip.generate({
          base64: false,
          compression: 'DEFLATE'
        });
        // Crea el archivo generado en el directorio final
        fs.writeFileSync(dirUserFileZip, data, 'binary');
        fs.unlinkSync(pathTem);
      }

      msg(0, 'Successful', "");
      res.status(200).send(response);
    }
  });
};


var PdfDocument = function(req, res) {
  var form = new multiparty.Form({
    uploadDir: dirTemp
  });
  form.parse(req, function(err, fields, files) {
    if (!files) {
      msg(1000, 'missing parameters', {});
      res.status(200).send(response);
    } else {
      //Path del archivo temporal
      var pathTem = files.file[0].path;
      //Extrae la extencion del archivo
      var fileExtension = (pathTem.split(".")[1]);


      if (fileExtension == 'pdf' || fileExtension == 'PDF') {
        var nameTmpFile = dirTemp + (pathTem.split("\\"))[1];
        var nameFileJPG = ((pathTem.split("\\"))[1]).split(".")[0];
        var opts = {
          format: 'jpeg',
          out_dir: path.dirname(nameTmpFile),
          out_prefix: nameFileJPG,
          page: 1
        }
        var dirJPGtTemp = dirTemp + nameFileJPG + '-1.jpg';

        pdf.convert(nameTmpFile, opts).then(resp => {
          //let prueba = path.resolve(dirJPGtTemp);
          var img = fs.readFileSync(dirJPGtTemp);

          res.writeHead(200, {'Content-Type': 'image/jpg' });
          res.end(img, 'binary');

        //  res.sendFile(img);

          fs.unlinkSync(pathTem);
           fs.unlinkSync(dirJPGtTemp);
          // msg(0, 'Successful', imgResolv);
          // res.sendFile(path.resolve(pathTem));

          // console.log(imgResolv);
          // fs.unlinkSync(pathTem);

        });


      } else {
        fs.unlinkSync(pathTem);
        msg(1001, 'File extension not supported', {});
        res.status(200).send(response);
      }


    }

  });
};

module.exports = {
  addDocument,
  PdfDocument
}
