game.PlayerEntity = me.Entity.extend({
  init: function (x, y) {
    var settings = {};
    settings.image = me.loader.getImage(CONFIG.PLAYER.IMAGE);
    settings.width = CONFIG.PLAYER.WIDTH;
    settings.height = CONFIG.PLAYER.HEIGHT;
    settings.framewidth = CONFIG.PLAYER.FRAMEWIDTH;
    settings.frameheight = CONFIG.PLAYER.FRAMEHEIGHT;

    this._super(me.Entity, 'init', [x, y, settings]);
    this.speed = CONFIG.PLAYER.SPEED;
    this.alwaysUpdate = true;
    this.collided = false;
    this.type = CONFIG.NAMES.PLAYER;

    this.frequencyBullet = CONFIG.BULLETP.FREQUENCY;
    this.generateB = 0;
  },
  update: function (dt) {
    var posDiff = me.timer.tick * this.speed;

    if (this.collided) { //byla kolizja
      return false;
    }

    if (me.input.isKeyPressed('left')) {
      if ((this.pos.x - posDiff) >= game.data.groundWidth) {
        this.pos.x -= posDiff;
      }
    } else if (me.input.isKeyPressed('right')) {
      if ((this.pos.x + posDiff) <= (game.data.width - game.data.groundWidth - CONFIG.PLAYER.WIDTH)) {
        this.pos.x += posDiff;
      }
    }
    game.data.playerPos.x = this.pos.x;
    game.data.fuel -= CONFIG.FUEL.LOSS;

    if (game.data.fuel <= CONFIG.FUEL.MIN) {
      console.warn('GAME OVER! No fuel');
      me.state.change(me.state.GAMEOVER);
    }

    if (this.generateB++ % this.frequencyBullet === 0) {
      var bullet = new me.pool.pull(CONFIG.NAMES.BULLETP, this.pos.x + CONFIG.BULLETP.WIDTH / 2, this.pos.y - CONFIG.BULLETP.HEIGHT);
      me.game.world.addChild(bullet, 11);
    }

    me.collision.check(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  },
  onCollision: function (response) {
    var obj = response.b;

    if (obj.type === CONFIG.NAMES.FUEL) {
      game.data.fuel = game.data.maxFuel;
      console.log('tank');
      obj.ancestor.removeChild(obj);
    }

    if (obj.type === CONFIG.NAMES.ENEMY || obj.type === CONFIG.NAMES.BULLETE) {
      this.collided = true;
      console.warn('GAME OVER!');
      me.state.change(me.state.GAMEOVER);
    }
  }
});

game.Ground = me.Entity.extend({
  init: function (x, y) {

  },
  update: function (dt) {

  }
});

game.EnemyVEntity = me.Entity.extend({
  init: function (x, y) {
    var settings = {};
    settings.image = this.image = me.loader.getImage(CONFIG.ENEMYV.IMAGE);
    settings.width = CONFIG.ENEMYV.WIDTH;
    settings.height = CONFIG.ENEMYV.HEIGHT;
    settings.framewidth = CONFIG.ENEMYV.FRAMEWIDTH;
    settings.frameheight = CONFIG.ENEMYV.FRAMEHEIGHT;

    this._super(me.Entity, 'init', [x, y, settings]);
    this.alwaysUpdate = true;

    this.body.vel.set(CONFIG.ENEMYV.SPEEDX, CONFIG.ENEMYV.SPEEDY);
    this.type = CONFIG.NAMES.ENEMY;

    this.generate = 0;
    this.frequency = CONFIG.ENEMYV.FREQUENCY;
  },
  update: function (dt) {
    this.pos.add(this.body.vel);
    if (this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
    }

    if (this.generate++ % this.frequency === 0) {
      var bullet = new me.pool.pull(CONFIG.NAMES.BULLETE, this.pos.x + 8, this.pos.y + 32);
      var diffPos = this.pos.x - game.data.playerPos.x;
      if (diffPos > 0) {
        bullet.body.vel.set(-1, 3);
      } else if (diffPos < 0) {
        bullet.body.vel.set(1, 3);
      } else {
        bullet.body.vel.set(0, 3);
      }
      me.game.world.addChild(bullet, 11);
    }

    me.Rect.prototype.updateBounds.apply(this);
    me.collision.check(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  },
  shouldCollide: function (a, b) {
    if (b.type === CONFIG.NAMES.ENEMY && a.type === CONFIG.NAMES.ENEMY) {
      return false;
    }
  },
  onCollision: function (response) {
    var secondObj = response.b;

    if (secondObj.type === CONFIG.NAMES.ENEMY || secondObj.type === CONFIG.NAMES.BULLETE) {
      return false;
    }

    if (secondObj.type === CONFIG.NAMES.BULLETP) {
      this.collided = true;
      console.log('enemy shot');
      game.data.score += CONFIG.ENEMYV.WORTH;
      secondObj.ancestor.removeChild(secondObj);
      this.ancestor.removeChild(this);
    }
  }
});

game.EnemyHEntity = me.Entity.extend({
  init: function (x, y) {
    var settings = {};
    settings.image = me.loader.getImage(CONFIG.ENEMYH.IMAGE);
    settings.width = CONFIG.ENEMYH.WIDTH;
    settings.height = CONFIG.ENEMYH.HEIGHT;
    settings.framewidth = CONFIG.ENEMYH.FRAMEWIDTH;
    settings.frameheight = CONFIG.ENEMYH.FRAMEHEIGHT;

    this._super(me.Entity, 'init', [x, y, settings]);
    this.alwaysUpdate = true;

    this.body.vel.set(CONFIG.ENEMYH.SPEEDX, CONFIG.ENEMYH.SPEEDY);
    this.type = CONFIG.NAMES.ENEMY;

    this.generate = 0;
    this.frequency = CONFIG.ENEMYH.FREQUENCY;
  },
  update: function (dt) {
    this.pos.add(this.body.vel);
    if (this.pos.x <= game.data.groundWidth) {
      this.body.vel.set(0, 1);
    }
    if (this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
    }

    if (this.generate++ % this.frequency === 0) {
      var bullet = new me.pool.pull(CONFIG.NAMES.BULLETE, this.pos.x + CONFIG.BULLETE.WIDTH / 2, this.pos.y + CONFIG.BULLETE.HEIGHT);
      var diffPos = this.pos.x - game.data.playerPos.x;

      if (diffPos > 0) {
        bullet.body.vel.set(-1, 2);
      } else if (diffPos < 0) {
        bullet.body.vel.set(1, 2);
      } else {
        bullet.body.vel.set(0, 2);
      }

      me.game.world.addChild(bullet, 11);
    }

    me.Rect.prototype.updateBounds.apply(this);
    me.collision.check(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  },
  shouldCollide: function (a, b) {
    if (b.type === CONFIG.NAMES.ENEMY && a.type === CONFIG.NAMES.ENEMY) {
      return false;
    }
  },
  onCollision: function (response) {
    var secondObj = response.b;

    if (secondObj.type === CONFIG.NAMES.ENEMY || secondObj.type === CONFIG.NAMES.BULLETE) {
      return false;
    }

    if (secondObj.type === CONFIG.NAMES.BULLETP) {
      this.collided = true;
      console.log('enemy shot');
      game.data.score += CONFIG.ENEMYH.WORTH;
      secondObj.ancestor.removeChild(secondObj);
      this.ancestor.removeChild(this);
    }
  }
});


game.BulletPEntity = me.Entity.extend({
  init: function (x, y) {
    var settings = {};
    settings.image = me.loader.getImage(CONFIG.BULLETP.IMAGE);
    settings.width = CONFIG.BULLETP.WIDTH;
    settings.height = CONFIG.BULLETP.HEIGHT;
    settings.framewidth = CONFIG.BULLETP.FRAMEWIDTH;
    settings.frameheight = CONFIG.BULLETP.FRAMEHEIGHT;

    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.vel.set(CONFIG.BULLETP.SPEEDX, CONFIG.BULLETP.SPEEDY);
    this.alwaysUpdate = true;
    this.collided = false;

    this.type = CONFIG.NAMES.BULLETP;
  },
  update: function (dt) {
    this.pos.add(this.body.vel);
    if (this.pos.y < 0) {
      this.ancestor.removeChild(this);
    }
    me.Rect.prototype.updateBounds.apply(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  }
});

game.BulletEEntity = me.Entity.extend({
  init: function (x, y) {
    var settings = {};
    settings.image = me.loader.getImage(CONFIG.BULLETE.IMAGE);
    settings.width = CONFIG.BULLETE.WIDTH;
    settings.height = CONFIG.BULLETE.HEIGHT;
    settings.framewidth = CONFIG.BULLETE.FRAMEWIDTH;
    settings.frameheight = CONFIG.BULLETE.FRAMEHEIGHT;

    this._super(me.Entity, 'init', [x, y, settings]);
    this.alwaysUpdate = true;
    this.collided = false;

    this.type = CONFIG.NAMES.BULLETE;
  },
  update: function (dt) {
    this.pos.add(this.body.vel);

    if (this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
    }
    me.Rect.prototype.updateBounds.apply(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  }
});

game.FuelEntity = me.Entity.extend({
  init: function (x, y) {
    var settings = {};
    settings.image = this.image = me.loader.getImage(CONFIG.FUEL.IMAGE);
    settings.width = CONFIG.FUEL.WIDTH;
    settings.height = CONFIG.FUEL.HEIGHT;
    settings.framewidth = CONFIG.FUEL.FRAMEWIDTH;
    settings.frameheight = CONFIG.FUEL.FRAMEHEIGHT;

    this._super(me.Entity, 'init', [x, y, settings]);
    this.alwaysUpdate = true;

    this.body.vel.set(CONFIG.FUEL.SPEEDX, CONFIG.FUEL.SPEEDY);
    this.type = CONFIG.NAMES.FUEL;
  },
  update: function (dt) {
    this.pos.add(this.body.vel);

    if (this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
    }

    me.Rect.prototype.updateBounds.apply(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  }
});

game.EnemiesGenerator = me.Renderable.extend({
  init: function () {
    this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
    this.alwaysUpdate = true;
    this.generateV = 0;
    this.frequencyV = 300;
    this.generateH = 0;
    this.frequencyH = 500;
  },
  update: function (dt) {
    if (this.generateV++ % this.frequencyV === 0) {
      var posX = Number.prototype.random(game.data.groundWidth, game.data.width - game.data.groundWidth - CONFIG.ENEMYV.WIDTH);
      var enemy = new me.pool.pull(CONFIG.NAMES.ENEMYV, posX, 0);
      me.game.world.addChild(enemy, 11);
    }

    if (this.generateH++ % this.frequencyH === 0) {
      var enemy = new me.pool.pull(CONFIG.NAMES.ENEMYH, game.data.width - game.data.groundWidth - CONFIG.ENEMYH.WIDTH, 0);
      me.game.world.addChild(enemy, 10);
    }

    this._super(me.Entity, 'update', [dt]);

    return true;
  }
});

game.FuelGenerator = me.Renderable.extend({
  init: function () {
    this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
    this.alwaysUpdate = true;
    this.generate = 1;
    this.frequency = CONFIG.FUEL.FREQUENCY;
  },
  update: function (dt) {
    if (this.generate++ % this.frequency === 0) {
      var posX = Number.prototype.random(game.data.groundWidth, game.data.width - game.data.groundWidth - 32);
      var fuel = new me.pool.pull(CONFIG.NAMES.FUEL, posX, 0);
      console.log('fuel added');
      me.game.world.addChild(fuel, 11);
    }

    this._super(me.Entity, 'update', [dt]);

    return true;
  }
});

game.Sensor = me.Entity.extend({
  init: function(x, y, points) {
    var settings = {};

    this._super(me.Entity, 'init', [x, y, points]);

    this.alwaysUpdate = true;
    this.body.vel.set(0, CONFIG.PLAYER.SPEEDY);
    this.type = CONFIG.NAMES.SENSOR;
  },
  update: function(dt) {
    this.pos.add(this.body.vel);

    this._super(me.Entity, 'update', [dt]);

    return true;
  },
  onCollision: function (response) {
    var secondObj = response.b;

    console.log('sensor collided');
  }
});
