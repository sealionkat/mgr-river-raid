me.Botapi = me.Object.extend({
  keyPressed: null,
  ws: null,

  init: function() {
    console.log('Creating WebSocket client');
    this.ws = new WebSocket('ws://localhost:8081', 'echo-protocol');
    this.ws.onopen = function() {
      console.warn('Bot connected to WebSocket server');
    };

    this.ws.onmessage = this.receiveMessage;
    this.ws.onerror = function(event) {
      console.warn('WebSocket connection error', event);
    };
    this.ws.onclose = function(event) {
      console.warn('WebSocket connection closed', event);
    };
  },
  getBoard: function() {
    return me.video.renderer.getContext2d(me.video.renderer.canvas).getImageData(0, 0, 480, 800);
  },
  pressLeftKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
    this.keyPressed = me.input.KEY.LEFT;
  },
  pressRightKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
    this.keyPressed = me.input.KEY.RIGHT;
  },
  releaseLeftKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
    this.keyPressed = null;
  },
  releaseRightKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
    this.keyPressed = null;
  },
  sendMessage: function() {

  },
  receiveMessage: function(event) {

  }
});
