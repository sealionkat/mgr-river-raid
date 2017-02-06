me.Botapi = me.Object.extend({
  init: function () {
    console.log('Creating bot');
  },
  initBoard: function () {
    this.board = me.video.renderer.getContext2d(me.video.renderer.canvas);
  },
  initWebSockets: function () {
    var deferred = Q.defer();
    var that = this;
    console.log('Creating WebSocket client');

    this.parseMessage = this.parseMessage.bind(this);

    this.ws = new WebSocket('ws://localhost:8081', 'echo-protocol');
    this.ws.onopen = function () {
      console.log('Bot connected to WebSocket server');
      deferred.resolve();
    };

    this.ws.onmessage = function (event) {
      switch (event.data) {
        case 'moveleft':
          that.pressLeftKey();
          that.sendStringMessage({type: 'pressedLeftKey', data: null});
          break;
        case 'releaseleft':
          that.releaseLeftKey();
          that.sendStringMessage({type: 'releasedLeftKey', data: null});
          break;
        case 'moveright':
          that.pressRightKey();
          that.sendStringMessage({type: 'pressedRightKey', data: null});
          break;
        case 'releaseright':
          that.releaseRightKey();
          that.sendStringMessage({type: 'releasedRightKey', data: null});
          break;
        case 'getplayerpos':
          that.sendStringMessage({type: 'playerpos', data: that.getPlayerPos()});
          break;
        case 'handshake':
          that.sendStringMessage({type: 'handshake', data: null});
          break;
        case 'whichbot':
          that.sendStringMessage({type: 'bot', data: 'random'});
          break;
        case 'botcreated':
          that.initBoard();
          that.sendStringMessage({
            type: 'idle', data: {
              boardSizes: [0, 0, 480, 800],
              groundWidth: game.data.groundWidth,
              playerPos: that.getPlayerPos()
            }
          });
          break;
        case 'getgamestate':
          that.sendStringMessage({
            type: 'gamestate', data: {
              playerPos: that.getPlayerPos(),
              gameObjects: that.getGameObjects()
            }
          });
          break;
        case 'getboard':
          that.sendBinaryMessage(that.getBoard().data);
          break;
        default:
          console.warn('unknown action', event.data);
      }
    };
    this.ws.onerror = function (event) {
      console.warn('WebSocket connection error', event);
      deferred.reject();
    };
    this.ws.onclose = function (event) {
      console.warn('WebSocket connection closed', event);
    };

    return deferred.promise;
  },
  sendGameOver: function () {
    this.sendStringMessage({type: 'gameover', data: null});
  },
  getPlayerPos: function () {
    return game.data.playerPos;
  },
  getBoard: function () {
    return this.board.getImageData(0, 0, 480, 800);
  },
  getGameObjects: function () {
    var objects = _.cloneDeep(me.game.world.children);
    var filteredObjects = [];
    objects = objects.filter(function (item) {
      switch (item.type) {
        case 'enemy':
        case 'bulletP':
        case 'bulletE':
        case 'fuel':
          return true;
        default:
          return false;
      }
    });

    for (var i = 0, iss = objects.length; i < iss; ++i) {
      var obj = objects[i];
      filteredObjects.push(_.pick(obj, ['pos', 'type', 'name']));
    }

    return filteredObjects;
  },
  pressLeftKey: function () {
    console.warn('invoked pressleft', this);
    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
    this.pressedKey = me.input.KEY.LEFT;
  },
  pressRightKey: function () {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
    this.pressedKey = me.input.KEY.RIGHT;
  },
  releaseLeftKey: function () {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
    this.pressedKey = null;
  },
  releaseRightKey: function () {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
    this.pressedKey = null;
  },
  sendStringMessage: function(msg) {
    this.ws.send(JSON.stringify(msg))
  },
  sendBinaryMessage: function(msg) {
    this.ws.send(msg);
  },
  parseMessage: function (event) {

  }
});
