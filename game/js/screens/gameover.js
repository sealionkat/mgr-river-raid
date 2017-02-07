game.GameoverScreen = me.ScreenObject.extend({
  onResetEvent: function () {
    var backgroundImage = new me.Sprite(0, 0, {
      image: me.loader.getImage('bgb-480x800'),
      anchorPoint: {x: 0, y: 0}
    });

    me.game.world.addChild(backgroundImage, 1);

    me.game.world.addChild(new (me.Renderable.extend({
      init: function () {
        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

        this.font = new me.Font('Arial', 20, 'black', 'left')
      },
      update: function (dt) {
        return true;
      },
      draw: function (renderer) {
        this.font.draw(renderer, 'Score: ' + game.data.score, 100, 240);
        this.font.draw(renderer, 'Menu - press Enter', 100, 280);
      }
    })), 2);

    me.input.bindKey(me.input.KEY.ENTER, 'title', true);

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === 'title') {
        me.state.change(me.state.MENU);
      }
    });
  },
  onDestroyEvent: function () {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
  }
});
