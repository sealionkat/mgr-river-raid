me.Botapi = me.Object.extend({
  init: function() {
    console.warn('bot api');
  },
  getBoard: function() {
    return me.video.renderer.getContext2d(me.video.renderer.canvas).getImageData(0, 0, 480, 800);
  },
  pressLeftKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
  },
  pressRightKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
  },
  releaseLeftKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
  },
  releaseRightKey: function() {
    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
  }
});
