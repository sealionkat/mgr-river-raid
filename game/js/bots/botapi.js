me.Botapi = me.Object.extend({
  init: function () {
    console.log('Creating bot');
  },
  initBoard: function () {
    this.board = me.video.renderer.getContext2d(me.video.renderer.canvas);
  },
  initTimer: function() {
    this.startTime = new Date();
  },
  stopTimer: function() {
    this.stopTime = new Date();
    this.elapsed = this.stopTime - this.startTime;
  },
  initWebSockets: function (botOptions) {
    var deferred = Q.defer();
    var that = this;
    console.log('Creating WebSocket client');

    this.parseMessage = this.parseMessage.bind(this);


    this.ws = new WebSocket('ws://localhost:8081', 'echo-protocol');
    this.ws.onopen = function () {
      console.warn('Bot connected to WebSocket server');
      that.botType = botOptions.bot;
      deferred.resolve();
    };

    this.ws.onmessage = function (event) {
      var getData = function() {
        return {
          playerPos: that.getPlayerPos(),
          gameObjects: that.getGameObjects(),
          playerVel: that.getPlayerVel(),
          fuel: that.getFuel()
        };
      };

      switch (event.data) {
        case CONFIG.RECEIVED_MESSAGES.MOVELEFT:
          console.log('move left');
          that.pressLeftKey();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.PRESSEDLEFTKEY,
            data: getData()
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.RELEASELEFT:
          that.releaseLeftKey();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.RELEASEDLEFTKEY,
            data: getData()
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.MOVERIGHT:
          console.log('move right');
          that.pressRightKey();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.PRESSEDRIGHTKEY,
            data: getData()
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.RELEASERIGHT:
          that.releaseRightKey();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.RELEASEDRIGHTKEY,
            data: getData()
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.RELEASEARROWKEY:
          console.log('release arrow');
          that.releaseArrowKey();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.RELEASEDARROWKEY,
            data: getData()
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.GETPLAYERPOS:
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.PLAYERPOS, data: that.getPlayerPos()});
          break;
        case CONFIG.RECEIVED_MESSAGES.HANDSHAKE:
          console.log('Handshake');
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.HANDSHAKE, data: null});
          break;
        case CONFIG.RECEIVED_MESSAGES.WHICHBOT:
          that.sendStringMessage({type: CONFIG.SENT_MESSAGES.BOT, data: botOptions.bot});
          break;
        case CONFIG.RECEIVED_MESSAGES.BOTCREATED:
          console.log('Botcreated');
          that.initBoard();
          that.initTimer();
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.IDLE,
            data: {
              boardSizes: [0, 0, CONFIG.BACKGROUND.WIDTH, CONFIG.BACKGROUND.HEIGHT],
              groundWidth: game.data.groundWidth,
              playerPos: that.getPlayerPos(),
              gameObjects: that.getGameObjects(),
              playerVel: that.getPlayerVel(),
              fuel: that.getFuel()
            }
          });
          break;
        case CONFIG.RECEIVED_MESSAGES.GETGAMESTATE:
          console.log('Get game state');
          that.sendStringMessage({
            type: CONFIG.SENT_MESSAGES.GAMESTATE,
            data: getData()
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
  isWebSocketOpen: function () {
    return typeof this.ws !== 'undefined' && this.ws !== null;
  },
  sendGameOver: function () {
    this.stopTimer();
    this.sendStringMessage({
      type: CONFIG.SENT_MESSAGES.GAMEOVER,
      data: {
        time: this.elapsed,
        score: game.data.score,
        fuel: game.data.fuel
      }
    });
  },
  sendReplay: function () {
    this.sendStringMessage({type: CONFIG.SENT_MESSAGES.REPLAY, data: null});
  },
  getPlayerPos: function () {
    return game.data.playerPos;
  },
  getPlayerVel: function () {
    return game.data.playerVel || 0;
  },
  getFuel: function () {
    return game.data.fuel || 0;
  },
  getBoard: function () {
    return this.board.getImageData(0, 0, CONFIG.BACKGROUND.WIDTH, CONFIG.BACKGROUND.HEIGHT);
  },
  getGameObjects: function () {
    var filteredObjects = [];
    var objects = me.game.world.children.filter(function (item) {
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
      var pickedObj = _.pick(obj, ['pos', 'type', 'body.vel', 'width', 'height']);
      filteredObjects.push({
        type: pickedObj.type,
        vel: pickedObj.body.vel,
        width: pickedObj.width,
        height: pickedObj.height,
        pos: {
          x: pickedObj.pos._x,
          y: pickedObj.pos._y
        }
      });
    }

    return filteredObjects;
  },
  pressLeftKey: function () {
    this.releaseArrowKey();
    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
    game.data.playerVel = -1;
    this.pressedKey = me.input.KEY.LEFT;
  },
  pressRightKey: function () {
    this.releaseArrowKey();
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
    game.data.playerVel = 1;
    this.pressedKey = me.input.KEY.RIGHT;
  },
  releaseLeftKey: function () {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
    game.data.playerVel = 0;
    this.pressedKey = null;
  },
  releaseRightKey: function () {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
    game.data.playerVel = 0;
    this.pressedKey = null;
  },
  releaseArrowKey: function () {
    if (this.pressedKey === me.input.KEY.LEFT) {
      this.releaseLeftKey();
    } else if (this.pressedKey === me.input.KEY.RIGHT) {
      this.releaseRightKey();
    }
  },
  sendStringMessage: function (msg) {
    this.ws.send(JSON.stringify(msg))
  },
  sendBinaryMessage: function (msg) {
    this.ws.send(msg);
  },
  parseMessage: function (event) {

  }
});
