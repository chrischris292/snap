var http = require("http");
var url = require("url");
var connect = require('connect');


function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  connect.createServer(
      connect.static(__dirname + "/js")
  ).listen(process.env.PORT,process.env.IP);
  console.log("Server has started.");
}

exports.start = start;
