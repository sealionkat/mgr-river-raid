me.Botapi = me.Object.extend({
  init: function () {
    console.log('Creating bot');
  },
  initBoard: function () {
    this.board = me.video.renderer.getContext2d(me.video.renderer.canvas);
  },
  initWebSockets: function (botOptions) {
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
        case CONFIG.RECEIVED_MESSAGES.MOVELEFT:
          that.pressLeftKey();
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.PRESSEDLEFTKEY, data: null});
          break;
        case CONFIG.RECEIVED_MESSAGES.RELEASELEFT:
          that.releaseLeftKey();
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.RELEASEDLEFTKEY, data: null});
          break;
        case CONFIG.RECEIVED_MESSAGES.MOVERIGHT:
          that.pressRightKey();
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.PRESSEDRIGHTKEY, data: null});
          break;
        case CONFIG.RECEIVED_MESSAGES.RELEASERIGHT:
          that.releaseRightKey();
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.RELEASEDRIGHTKEY, data: null});
          break;
        case CONFIG.RECEIVED_MESSAGES.GETPLAYERPOS:
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.PLAYERPOS, data: that.getPlayerPos()});
          break;
        case CONFIG.RECEIVED_MESSAGES.HANDSHAKE:
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.HANDSHAKE, data: null});
          break;
        case CONFIG.RECEIVED_MESSAGES.WHICHBOT:
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.BOT, data: botOptions.bot});
          break;
        case CONFIG.RECEIVED_MESSAGES.BOTCREATED:
          that.initBoard();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.IDLE,
            data: {
              boardSizes: [0, 0, CONFIG.BACKGROUND.WIDTH, CONFIG.BACKGROUND.HEIGHT],
              groundWidth: game.data.groundWidth,
              playerPos: that.getPlayerPos()
            }
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.GETGAMESTATE:
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.GAMESTATE,
            data: {
              playerPos: that.getPlayerPos(),
              gameObjects: that.getGameObjects()
            }
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.GETBOARD:
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
  isWebSocketOpen: function() {
    return typeof this.ws !== 'undefined' && this.ws !== null;
  },
  sendGameOver: function () {
    this.sendStringMessage({type: CONFIG.SENT_MESSAGES.GAMEOVER, data: null});
  },
  getPlayerPos: function () {
    return game.data.playerPos;
  },
  getBoard: function () {
    return this.board.getImageData(0, 0, CONFIG.BACKGROUND.WIDTH, CONFIG.BACKGROUND.HEIGHT);
  },
  getGameObjects: function () {
    var objects = _.cloneDeep(me.game.world.children);
    var filteredObjects = [];
    objects = objects.filter(function (item) {
      switch (item.type) {
        case CONFIG.NAMES.ENEMY:
        case CONFIG.NAMES.BULLETP:
        case CONFIG.NAMES.BULLETE:
        case CONFIG.NAMES.FUEL:
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
