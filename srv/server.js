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
  autoAcceptConnections: false,
  maxReceivedFrameSize: 20000000
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
  let bot = null;
  let gameover = false;
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);

      switch (data.type) {
        case 'handshake':
          console.log('handshake!');
          connection.sendUTF('whichbot');
          break;
        case 'bot':
          console.log('bot!');
          bot = new RandomBot();
          connection.sendUTF('botcreated');
          break;
        case 'gamestate':
          console.log('gamestate!');
          if(!gameover) {
            setTimeout(function () {
              connection.sendUTF('getgamestate');
            }, 100);
          }
          break;
        case 'gameover':
          gameover = true;
          console.log('gameover');
          break;
        default:
          console.warn('unknown action!');
      }

      /*
      {
      type: string
      data: object | string | null
       */

    }
  });

  if (connection.connected) {
    connection.sendUTF('handshake');
  }

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    console.log('Reason', reasonCode, ': ', description);
  });
});