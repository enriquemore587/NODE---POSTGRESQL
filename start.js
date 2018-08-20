#!/usr/bin/env node
'user strict'
 
try {
  require('fs').mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}


var log4js = require('log4js');
log4js.configure('./config/log4js.json');

var app = require("./app.js");

const port = 3789;
require("fs").readFile('./ATREVA.txt', 'utf8',function (err,atreva) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    //var log = log4js.getLogger(". : S T A R T U P - C R E D I - W H E R E : .");
    var log = log4js.getLogger(atreva);
    app.listen(port, () => {
      log.info('Start Server port: ' + port);
      console.log(atreva, 'Start Server port: ' + port);
    });
});
