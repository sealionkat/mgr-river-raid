game.TitleScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      var backgroundImage = new me.Sprite(0, 0, {
        image: me.loader.getImage('bgb-480x800'),
        anchorPoint: {x: 0, y: 0}
      });

      me.game.world.addChild(backgroundImage, 1);

      me.game.world.addChild(new (me.Renderable.extend({
        init: function() {
          this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

          this.font = new me.Font('Arial', 20, 'black', 'left')
        },
        update: function(dt) {
          return true;
        },
        draw: function(renderer) {
          this.font.draw(renderer, 'Human play - press 1', 100, 240);
          this.font.draw(renderer, 'Simple bot play - press 2', 100, 280);
        }
      })), 2);

      me.input.bindKey(me.input.KEY.NUM1, 'human', true);
      me.input.bindKey(me.input.KEY.NUM2, 'simple', true);

      this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
        if(action === 'human') {
          me.state.change(me.state.PLAY);
        } else if(action === 'simple') {
          me.game.bot = new me.Botapi();

          me.game.bot.initWebSockets().then(function() {
            console.log('Initialized WebSockets');
            me.state.change(me.state.PLAY);
          });
        }
      });
    },
    onDestroyEvent: function() {
      me.input.unbindKey(me.input.KEY.NUM1);
      me.event.unsubscribe(this.handler);
    }
});
