game.PlayScreen = me.ScreenObject.extend({
	init: function() {
		this._super(me.ScreenObject, 'init');
	},
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;

		me.game.world.addChild(
			new me.Sprite(
				0,0, {
					image: me.loader.getImage('bgb-480x800')
				}
			),
			1
		);

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);

		this.bird = me.pool.pull('mainPlayer', 60, me.game.viewport.height / 2 - 100);
		me.game.world.addChild(this.bird, 10);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
        me.game.world.removeChild(this.bird);


    }
});
