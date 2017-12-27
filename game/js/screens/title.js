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
          this.font.draw(renderer, 'Reinforcement Learning bot - press 3', 100, 320);
          this.font.draw(renderer, 'RL bot (learning mode) - press 4', 100, 360);
        }
      })), 2);

      me.input.bindKey(me.input.KEY.NUM1, 'human', true);
      me.input.bindKey(me.input.KEY.NUM2, 'simple', true);
      me.input.bindKey(me.input.KEY.NUM3, 'rlbot', true);
      me.input.bindKey(me.input.KEY.NUM4, 'rllearn', true);

      this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
        if(action === 'human') {
          me.game.bot = null;
          me.state.change(me.state.PLAY);
        } else if(action === 'simple') {
          me.game.bot = new me.Botapi();

          me.game.bot.initWebSockets({bot: 'random'}).then(function() {
            console.log('Initialized WebSockets');
            me.state.change(me.state.PLAY);
          });
        } else if(action === 'rlbot') {
          me.game.bot = new me.Botapi();
          console.log('rlbot once')

          me.game.bot.initWebSockets({bot: 'rl'}).then(function() {
            console.log('WebSocket + reinforcement learning bot');

            me.state.change(me.state.PLAY);
          });

        } else if(action === 'rllearn') {
          me.game.bot = new me.Botapi();
          console.log('rlbot learning');

          if(!me.game.bot.isWebSocketOpen()) {
            me.game.bot.initWebSockets({bot: 'rlc'}).then(function() {
              console.log('WebSocket + reinforcement learning bot + learning mode');

              me.state.change(me.state.PLAY);
            });
          }
        }
      });
    },
    onDestroyEvent: function() {
      me.input.unbindKey(me.input.KEY.NUM1);
      me.event.unsubscribe(this.handler);
    }
});
