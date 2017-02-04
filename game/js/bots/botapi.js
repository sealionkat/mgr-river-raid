me.Botapi = me.Object.extend({
  init: function () {
    console.log('Creating bot');
  },
  initWebSockets: function () {
    var deferred = Q.defer();
    var that = this;
    console.log('Creating WebSocket client');

    this.pressLeftKey = this.pressLeftKey.bind(this);

    this.ws = new WebSocket('ws://localhost:8081', 'echo-protocol');
    this.ws.onopen = function () {
      console.warn('Bot connected to WebSocket server');
      deferred.resolve();
    };

    this.ws.onmessage = function (event) {
      switch (event.data) {
        case 'moveleft':
          that.pressLeftKey();
          break;
        case 'releaseleft':
          that.releaseLeftKey();
          break;
        case 'moveright':
          that.pressRightKey();
          break;
        case 'releaseright':
          that.releaseRightKey();
          break;
        case 'getplayerpos':
          that.sendMessage(JSON.stringify({type: 'playerpos', data: that.getPlayerPos()}));
          break;
        case 'handshake':
          that.sendMessage(JSON.stringify({type: 'handshake', data: null}));
          break;
        case 'whichbot':
          that.sendMessage(JSON.stringify({type: 'bot', data: 'random'}));
          break;
        case 'botcreated':
          that.initBoard();
          that.sendMessage(JSON.stringify({type: 'idle', data: {}}));
          break;
        case 'getgamestate':
          that.sendMessage(JSON.stringify({
            type: 'gamestate', data: {
              playerPos: that.getPlayerPos(),
              gameObjects: that.getGameObjects()
            }
          }));

          break;
        case 'getboard':
          console.log('getboard');
          that.sendMessage(that.getBoard().data);
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
  initBoard: function () {
    this.board = me.video.renderer.getContext2d(me.video.renderer.canvas);
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
    objects.filter(function(item) {
      switch(item.type) {
        case 'enemy':
        case 'bulletP':
        case 'bulletE':
        case 'fuel':
          return true;
        default:
          return false;
      }
    });

    for(var i = 0, iss = objects.length; i < iss; ++i) {
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
  sendGameOver: function () {
    this.sendMessage(JSON.stringify({type: 'gameover'}));
  },
  sendMessage: function (msg) {
    this.ws.send(msg);
  },
  parseMessage: function (event) {

  }
});
