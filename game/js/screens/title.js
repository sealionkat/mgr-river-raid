game.TitleScreen = me.ScreenObject.extend({
    init: function() {
        
    },
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        game.data.score = 0;

		me.game.world.addChild(
			new me.Sprite(
				0,0, {
					image: me.loader.getImage('bgb-480x800')
				}
			),
			1
		);

		//me.game.world.addChild(new BackgroundLayer('bgb-480x800', 1));
		me.input.bindKey(me.input.KEY.ENTER, 'enter', true);
		me.input.bindKey(me.input.KEY.SPACE, 'enter', true);

		this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
			if(action == 'enter') {
				me.state.change(me.state.PLAY);
			}
		});



		var logoImg = me.loader.getImage('title');
		this.logo = new me.Sprite(0, - logoImg, {image: logoImg});
		me.game.world.addChild(this.logo, 10);
         // TODO
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
		me.event.unsubscribe(this.handler);
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.SPACE);
        ; // TODO
    }
});
