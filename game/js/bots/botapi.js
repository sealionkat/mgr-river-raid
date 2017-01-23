me.Botapi = me.Object.extend({
  init: function() {
    console.log('Creating bot');
  },
  initWebSockets: function() {
    var deferred = Q.defer();
    var that = this;
    console.log('Creating WebSocket client');

    this.pressLeftKey.bind(this);

    this.ws = new WebSocket('ws://localhost:8081', 'echo-protocol');
    this.ws.onopen = function() {
      console.warn('Bot connected to WebSocket server');
      deferred.resolve();
    };

    this.ws.onmessage = function(event) {
      console.warn('received message', event);

      switch(event.data) {
        case 'moveleft':
          that.pressLeftKey();
          break;
        case 'playerpos':
          that.sendMessage(JSON.stringify(that.getPlayerPos()));
          break;
        default:
          console.warn('unknown action');
      }
    };
    this.ws.onerror = function(event) {
      console.warn('WebSocket connection error', event);
      deferred.reject();
    };
    this.ws.onclose = function(event) {
      console.warn('WebSocket connection closed', event);
    };


    return deferred.promise;
  },
  getPlayerPos: function() {
    return game.data.playerPos;
  },
  getBoard: function() {
    return me.video.renderer.getContext2d(me.video.renderer.canvas).getImageData(0, 0, 480, 800);
  },
  pressLeftKey: function() {
    console.warn('invoked pressleft', this);
    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
    this.pressedKey = me.input.KEY.LEFT;
  },
  pressRightKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
    this.pressedKey = me.input.KEY.RIGHT;
  },
  releaseLeftKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
    this.pressedKey = null;
  },
  releaseRightKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
    this.pressedKey = null;
  },
  sendMessage: function(msg) {
    this.ws.send(msg);
  },
  receiveMessage: function(event) {
    console.log('thisss', this);
    console.warn('received message', event );

    switch (event.data) {
      case 'moveleft':
        this.pressLeftKey();
        break;
      default:
        console.warn('unknown action');
        break;
    }
  }
});
