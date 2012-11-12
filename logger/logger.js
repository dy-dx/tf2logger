
/**
 * /logger/logger.js
 */

var dgram = require('dgram');
// var util = require('util');
var fs = require('fs');


var logDir = __dirname+'/../public/logs/';
var currentFileNames = {};

module.exports = function() {
  // var stream = fs.createWriteStream("../public/logs/log.log", {
  //   flags: 'w',
  //   encoding: "utf8",
  //   mode: 0666 });

  var server = dgram.createSocket('udp4');
  server.on('message', function (message, rinfo) {

    var msg = message.toString('ascii').slice(5,-1);
    var tf2server = rinfo.address + '-' + rinfo.port;
    var logPath = logDir+tf2server+'/';
    
    // Check if this server has a currentFileName.
    //  If it doesn't, read the files in directory, and 
    //  make its currentFileName the last one + 1.
    if (!currentFileNames[tf2server]) {
      var filename = 1;

      // Check if directory exists before reading it
      //  If it doesn't exist then create it, and the filename will be 1.log
      if ( fs.existsSync(logPath) ) {
        var files = fs.readdirSync(logPath).sort().reverse();
        if (files.length !== 0) {
          filename = parseInt(files[0].split('.')[0], 10) + 1;
        }
      } else {
        fs.mkdirSync(logPath);
      }
      currentFileNames[tf2server] = filename;
    }

    // Append the message to the file.
    fs.appendFileSync(logPath+currentFileNames[tf2server]+'.log', msg, 'ascii', function(err) {
      if (err) console.log(err);
    });

    // If that was the last message in the log, increment filename.
    if (msg.slice(21,-1) == ': Log file closed') {
      currentFileNames[tf2server] += 1;
    }

  });

  server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening ' + address.address + ':' + address.port);
  });

  server.bind(8006);
  // server listening 0.0.0.0:8006
};
