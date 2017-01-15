me.Botapi = me.Object.extend({
  getBoard: function() {

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
