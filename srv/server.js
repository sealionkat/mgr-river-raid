const WebSocketServer = require('websocket').server;
const http = require('http');
const RandomBot = require('./bots/randomBot');

const server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8081, function() {
  console.log((new Date()) + ' Server is listening on port 8081');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

let connection = null;

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');

    return;
  }

  connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);

      //connection.sendUTF(message.utf8Data);



      setTimeout(() => {
        connection.sendUTF('playerpos')
      }, 100);
      //connection.sendUTF('playerpos');
    }
  });

  setTimeout(() => {
    if(connection.connected) {
      connection.sendUTF('moveleft');
      connection.sendUTF('playerpos');
    }
  }, 100);

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});