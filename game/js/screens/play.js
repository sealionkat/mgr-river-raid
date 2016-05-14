game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');

        game.data.score = 0;
        game.data.fuel = 100;

		var background  = new me.Sprite(0, 0, {
			image: me.loader.getImage('bgb-480x800'),
			anchorPoint: {x: 0, y: 0}
		});
		me.game.world.addChild(background, 1);

        this.plane = me.pool.pull('player', game.data.width / 2, game.data.height - 100);
		me.game.world.addChild(this.plane, 11);

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
