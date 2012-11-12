
/**
 * /logger/logger.js
 */

var dgram = require("dgram");
var fs = require("fs");


module.exports = function() {
  // var stream = fs.createWriteStream("received.json", {
  //   flags: 'w',
  //   encoding: "utf8",
  //   mode: 0666 });

  var server = dgram.createSocket("udp4");
  server.on('message', function (msg, rinfo) {
    console.log('server got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
    // stream.write(msg);
  });

  server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening ' + address.address + ':' + address.port);
  });

  server.bind(8006);
  // server listening 0.0.0.0:8006
};
