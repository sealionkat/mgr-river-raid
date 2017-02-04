game.PlayerEntity = me.Entity.extend({
	init: function(x, y) {
		var settings = {};
		settings.image = me.loader.getImage('player-32x32');
		settings.width = 32;
		settings.height = 32;
		settings.framewidth = 32;
		settings.frameheight = 32;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.speed = 2.0;
		this.alwaysUpdate = true;
		this.collided = false;
		this.type = 'player';

		this.frequencyBullet = 75;
		this.generateB = 0;
	},
	update: function(dt) {
		var posDiff = me.timer.tick * this.speed;

		if(this.collided) { //byla kolizja
			return false;
		}

		if(me.input.isKeyPressed('left')) {
			if((this.pos.x - posDiff) >= game.data.groundWidth) {
				this.pos.x -= posDiff;
			}
		} else if(me.input.isKeyPressed('right')) {
			if((this.pos.x + posDiff) <= (game.data.width - game.data.groundWidth - 32)) {
				this.pos.x += posDiff;
			}
		}
		game.data.playerPos.x = this.pos.x;
		game.data.fuel -= 1;

		if(game.data.fuel <= 0) {
      console.warn('GAME OVER! No fuel');
      me.state.change(me.state.GAMEOVER);
    }


		if(this.generateB++ % this.frequencyBullet == 0) {
			var bullet = new me.pool.pull('bulletP', this.pos.x + 8, this.pos.y - 16);
			me.game.world.addChild(bullet, 11);
		}


		me.collision.check(this);
		this._super(me.Entity, 'update', [dt]);

		return true;
	},
	onCollision: function(response) {
		var obj = response.b;

		if(obj.type == 'fuel') {
			game.data.fuel = game.data.maxFuel;
			console.log('tank');
      obj.ancestor.removeChild(obj);
		}

		if(obj.type == 'enemy' || obj.type == 'bulletE') {
			this.collided = true;
			console.warn('GAME OVER!');
			me.state.change(me.state.GAMEOVER);
		}
	}
});

game.Ground = me.Entity.extend({
	init: function(x, y) {

	},
	update: function(dt) {

	}
});

game.EnemyVEntity = me.Entity.extend({
	init: function(x, y) {
		var settings = {};
		settings.image = this.image = me.loader.getImage('enemy1-32x32');
		settings.width = 32;
		settings.height = 32;
		settings.framewidth = 32;
		settings.frameheight = 32;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.alwaysUpdate = true;

		this.body.vel.set(0, 2);
		this.type = 'enemy';

		this.generate = 0;
		this.frequency = 100;
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
		}

		if(this.generate++ % this.frequency == 0) {
			var bullet = new me.pool.pull('bulletE', this.pos.x + 8, this.pos.y + 32);
			var diffPos = this.pos.x - game.data.playerPos.x; //todo
			if(diffPos > 0) {
				bullet.body.vel.set(-1, 3);
			} else if(diffPos < 0) {
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
	shouldCollide: function(a, b) {
		if(b.type == 'enemy' && a.type == 'enemy') {
			return false;
		}
	},
	onCollision: function(response) {
		var secondObj = response.b;

		if(secondObj.type == 'enemy' || secondObj.type == 'bulletE') {
			return false;
		}
		if(secondObj.type == 'bulletP') {
			this.collided = true;
			console.log('enemy shot');
			game.data.score += 50;
      secondObj.ancestor.removeChild(secondObj);
      this.ancestor.removeChild(this);
		}

	}
});

game.EnemyHEntity = me.Entity.extend({
	init: function(x, y) {
		var settings = {};
		settings.image = me.loader.getImage('enemy2-32x32');
		settings.width = 32;
		settings.height = 32;
		settings.framewidth = 32;
		settings.frameheight = 32;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.alwaysUpdate = true;

		this.body.vel.set(-1, 1);
		this.type = 'enemy';

		this.generate = 0;
		this.frequency = 100;
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.x <= game.data.groundWidth) {
			this.body.vel.set(0, 1);
		}
		if(this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
		}

		if(this.generate++ % this.frequency == 0) {
			var bullet = new me.pool.pull('bulletE', this.pos.x + 8, this.pos.y + 32);
			var diffPos = this.pos.x - game.data.playerPos.x; //todo
			if(diffPos > 0) {
				bullet.body.vel.set(-1, 2);
			} else if(diffPos < 0) {
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
	shouldCollide: function(a, b) {
		if(b.type == 'enemy' && a.type == 'enemy') {
			return false;
		}
	},
	onCollision: function(response) {
		var secondObj = response.b;

		if(secondObj.type == 'enemy' || secondObj.type == 'bulletE') {
			return false;
		}
		if(secondObj.type == 'bulletP') {
			this.collided = true;
			console.log('enemy shot');
			game.data.score += 50;
      secondObj.ancestor.removeChild(secondObj);
      this.ancestor.removeChild(this);
		}

	}
});


game.BulletPEntity = me.Entity.extend({
	init: function(x, y) {
		var settings = {};
		settings.image = me.loader.getImage('bulletP-16x16');
		settings.width = 16;
		settings.height = 16;
		settings.framewidth = 16;
		settings.frameheight = 16;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.body.vel.set(0, -2);
		this.alwaysUpdate = true;
		this.collided = false;

		this.type = 'bulletP';
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.y < 0) {
      this.ancestor.removeChild(this);
		}
		me.Rect.prototype.updateBounds.apply(this);
		this._super(me.Entity, 'update', [dt]);

		return true;
	}
});

game.BulletEEntity = me.Entity.extend({
	init: function(x, y) {
		var settings = {};
		settings.image = me.loader.getImage('bulletE-16x16');
		settings.width = 16;
		settings.height = 16;
		settings.framewidth = 16;
		settings.frameheight = 16;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.alwaysUpdate = true;
		this.collided = false;

		this.type = 'bulletE';
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.y > game.data.height) {
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
		settings.image = this.image = me.loader.getImage('fuel-32x32');
		settings.width = 32;
		settings.height = 32;
		settings.framewidth = 32;
		settings.frameheight = 32;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.alwaysUpdate = true;

		this.body.vel.set(0, 1);
		this.type = 'fuel';
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.y > game.data.height) {
      this.ancestor.removeChild(this);
		}
		me.Rect.prototype.updateBounds.apply(this);
		this._super(me.Entity, 'update', [dt]);

		return true;
	}
});

game.EnemiesGenerator = me.Renderable.extend({
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
		this.alwaysUpdate = true;
		this.generateV = 0;
		this.frequencyV = 300;
		this.generateH = 0;
		this.frequencyH = 500;
	},
	update: function(dt) {
		if(this.generateV++ % this.frequencyV == 0) {
			var posX = Number.prototype.random(game.data.groundWidth, game.data.width - game.data.groundWidth - 32);
			var enemy = new me.pool.pull('enemyV', posX, 0);
			me.game.world.addChild(enemy, 11);
		}
		if(this.generateH++ % this.frequencyH == 0) {
			var enemy = new me.pool.pull('enemyH', game.data.width - game.data.groundWidth - 32, 0);
			me.game.world.addChild(enemy, 10);
		}
		this._super(me.Entity, 'update', [dt]);

		return true;
	}
});

game.FuelGenerator = me.Renderable.extend({
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
		this.alwaysUpdate = true;
		this.generate = 1;
		this.frequency = 800;
	},
	update: function(dt) {
		if(this.generate++ % this.frequency == 0) {
			var posX = Number.prototype.random(game.data.groundWidth, game.data.width - game.data.groundWidth - 32);
			var fuel = new me.pool.pull('fuel', posX, 0);
			console.log('fuel added');
			me.game.world.addChild(fuel, 11);
		}

		this._super(me.Entity, 'update', [dt]);

		return true;
	}
});
