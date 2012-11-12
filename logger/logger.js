
/**
 * /logger/logger.js
 */

var dgram = require('dgram');
// var util = require('util');
var fs = require('fs');

var logPath = __dirname+'/../public/logs/';

module.exports = function() {
  // var stream = fs.createWriteStream("../public/logs/log.log", {
  //   flags: 'w',
  //   encoding: "utf8",
  //   mode: 0666 });

  var server = dgram.createSocket('udp4');
  server.on('message', function (msg, rinfo) {

    fs.appendFileSync(logPath+rinfo.address+'-'+rinfo.port+'.log', msg.toString('ascii').slice(7,-1), 'ascii', function(err) {
      if (err) console.log(err);
    });

  });

  server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening ' + address.address + ':' + address.port);
  });

  server.bind(8006);
  // server listening 0.0.0.0:8006
};
