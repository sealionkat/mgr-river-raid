/* Game namespace */
var game = {
  data: {
    score: CONFIG.INIT.SCORE,
    fuel: CONFIG.INIT.FUEL,
    maxFuel: CONFIG.INIT.MAXFUEL,
    height: CONFIG.INIT.HEIGHT,
    width: CONFIG.INIT.WIDTH,
    groundWidth: CONFIG.INIT.GROUNDWIDTH
  },
  onload: function () {
    if (!me.video.init(CONFIG.INIT.WIDTH, CONFIG.INIT.HEIGHT, {wrapper: 'screen', scale: 'auto'})) {
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
  loaded: function () {
    this.titleScreen = new game.TitleScreen();
    this.playScreen = new game.PlayScreen();
    this.gameoverScreen = new game.GameoverScreen();
    me.state.set(me.state.MENU, this.titleScreen);
    me.state.set(me.state.PLAY, this.playScreen);
    me.state.set(me.state.GAMEOVER, this.gameoverScreen);

    me.input.bindKey(me.input.KEY.LEFT, 'left');
    me.input.bindKey(me.input.KEY.RIGHT, 'right');

    me.pool.register(CONFIG.NAMES.PLAYER, game.PlayerEntity);
    me.pool.register(CONFIG.NAMES.ENEMYV, game.EnemyVEntity);
    me.pool.register(CONFIG.NAMES.ENEMYH, game.EnemyHEntity, true);
    me.pool.register(CONFIG.NAMES.BACKGROUND, game.Ground);
    me.pool.register(CONFIG.NAMES.BULLETP, game.BulletPEntity, true);
    me.pool.register(CONFIG.NAMES.BULLETE, game.BulletEEntity, true);
    me.pool.register(CONFIG.NAMES.FUEL, game.FuelEntity, true);

    me.game.viewport.setBounds(0, 0, CONFIG.INIT.WIDTH, CONFIG.INIT.HEIGHT);

    me.state.change(me.state.MENU);
  }
};
