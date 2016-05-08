
/* Game namespace */
var game = {
    data : {
        score : 0,
        fuel: 100
    },
    'onload' : function () {
        if (!me.video.init(480, 800, {wrapper : 'screen', scale : 'auto'})) {
            alert('Your browser does not support HTML5 canvas.');
            return;
        }

        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, 'debug', me.input.KEY.V);
            });
        }

        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.resources);
        me.state.change(me.state.LOADING);
    },
    'loaded' : function () {
        //me.state.set(me.state.MENU, new game.TitleScreen());
        this.playScreen = new game.PlayScreen();
        me.state.set(me.state.PLAY, this.playScreen);

        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.RIGHT, 'right');

		me.pool.register('player', game.PlayerEntity);
		me.pool.register('enemyV', game.EnemyVEntity, true);
		me.pool.register('enemyH', game.EnemyHEntity, true);
		me.pool.register('rockS', game.RockSEntity, true);
		me.pool.register('rockB', game.RockBEntity, true);
		me.pool.register('background', game.Ground);
		me.pool.register('bullet', game.BulletEntity, true);
		me.pool.register('fuel', game.FuelEntity, true);

        me.state.change(me.state.PLAY);
    }
};
