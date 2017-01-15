/* Game namespace */
var game = {
	data: {
		score: 0,
		fuel: 2000,
		maxFuel: 2000,
		height: 800,
		width: 480,
		groundWidth: 30
	},
	onload: function() {
		if(!me.video.init(480, 800, {wrapper: 'screen', scale: 'auto'})) {
			alert('Your browser does not support HTML5 canvas.');

			return;
		}

		if(me.game.HASH.debug === true) {
			window.onReady(function() {
				me.plugin.register.defer(this, me.debug.Panel, 'debug', me.input.KEY.V);
			});
		}

		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(game.resources);
		me.state.change(me.state.LOADING);
	},
	loaded: function() {
		//me.state.set(me.state.MENU, new game.TitleScreen());
		this.playScreen = new game.PlayScreen();
		this.gameoverScreen = new game.GameoverScreen();
		me.state.set(me.state.PLAY, this.playScreen);
		me.state.set(me.state.GAMEOVER, this.gameoverScreen);

		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');

		me.pool.register('player', game.PlayerEntity);
		me.pool.register('enemyV', game.EnemyVEntity);
		me.pool.register('enemyH', game.EnemyHEntity, true);
		me.pool.register('rockS', game.RockSEntity, true);
		me.pool.register('rockB', game.RockBEntity, true);
		me.pool.register('background', game.Ground);
		me.pool.register('bulletP', game.BulletPEntity, true);
		me.pool.register('bulletE', game.BulletEEntity, true);
		me.pool.register('fuel', game.FuelEntity, true);

		me.game.viewport.setBounds(0, 0, 480, 800);
		me.state.change(me.state.PLAY);
	}
};
