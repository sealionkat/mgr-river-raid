game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');

		game.data.score = 0;
		game.data.fuel = 2000;
		game.data.playerPos = {
			x: game.data.width / 2,
			y: game.data.height - 100
		};

		var background = new me.Sprite(0, 0, {
			image: me.loader.getImage('bgb-480x800'),
			anchorPoint: {x: 0, y: 0}
		});
		me.game.world.addChild(background, 1);

		this.plane = me.pool.pull('player', game.data.width / 2, game.data.height - 100);
		me.game.world.addChild(this.plane, 11);

		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

		this.enemyGenerator = new game.EnemiesGenerator();
		me.game.world.addChild(this.enemyGenerator, 0);

		this.fuelGenerator = new game.FuelGenerator();
		me.game.world.addChild(this.fuelGenerator, 0);

	},
	onDestroyEvent: function() {
		me.game.world.removeChild(this.HUD);

		if (typeof me.game.bot !== 'undefined') {
			me.game.bot.sendGameOver();
		}
		//todo
	}
});
