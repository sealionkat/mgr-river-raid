game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');

		game.data.score = CONFIG.INIT.SCORE;
		game.data.fuel = CONFIG.INIT.FUEL;
		game.data.playerPos = {
			x: game.data.width / 2,
			y: game.data.height - 100
		};

		var background = new me.Sprite(0, 0, {
			image: me.loader.getImage(CONFIG.BACKGROUND.IMAGE),
			anchorPoint: {x: 0, y: 0}
		});
		me.game.world.addChild(background, 1);

		this.plane = me.pool.pull(CONFIG.NAMES.PLAYER, game.data.width / 2, game.data.height - 100);
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
		me.game.world.removeChild(this.plane);
		me.game.world.removeChild(this.enemyGenerator);
		me.game.world.removeChild(this.fuelGenerator);

		if (typeof me.game.bot !== 'undefined' && me.game.bot !== null) {
			me.game.bot.sendGameOver();
		}

		me.input.unbindKey(me.input.KEY.LEFT);
    me.input.unbindKey(me.input.KEY.RIGHT);
	}
});
