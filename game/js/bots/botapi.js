me.Botapi = me.Object.extend({
  init: function() {
    console.log('Creating bot');
  },
  initWebSockets: function() {
    var deferred = Q.defer();
    console.log('Creating WebSocket client');
    this.ws = new WebSocket('ws://localhost:8081', 'echo-protocol');
    this.ws.onopen = function() {
      console.warn('Bot connected to WebSocket server');
      deferred.resolve();
    };

    this.ws.onmessage = this.receiveMessage;
    this.ws.onerror = function(event) {
      console.warn('WebSocket connection error', event);
      deferred.reject();
    };
    this.ws.onclose = function(event) {
      console.warn('WebSocket connection closed', event);
    };

    return deferred.promise;
  },
  getBoard: function() {
    return me.video.renderer.getContext2d(me.video.renderer.canvas).getImageData(0, 0, 480, 800);
  },
  pressLeftKey: function() {
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
  sendMessage: function() {

  },
  receiveMessage: function(event) {

  }
});
