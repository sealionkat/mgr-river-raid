game.PlayerEntity = me.Entity.extend({
	init: function(x, y) {
		var settings = {};
		settings.image = me.loader.getImage('player-32x32');
		settings.width = 32;
		settings.height = 32;
		settings.framewidth = 32;
		settings.frameheight = 32;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.speed = 1.0;
		this.alwaysUpdate = true;
		this.collided = false;
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



		me.collision.check(this);
		this._super(me.Entity, 'update', [dt]);
		return true;
	},
	onCollision: function(response) {
		var obj = response.b;

		if(obj.type == 'enemy') {
			this.collided = true;
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

		this.body.vel.set(0, 1);
		this.type = 'enemy';
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.y > game.data.height) {
			me.game.world.removeChild(this);
		}
		me.Rect.prototype.updateBounds.apply(this);
		this._super(me.Entity, 'update', [dt]);
		return true;
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
	},
	update: function(dt) {
		this.pos.add(this.body.vel);
		if(this.pos.x <= game.data.groundWidth) {
			this.body.vel.set(0, 1);
		}
		if(this.pos.y > game.data.height) {
			me.game.world.removeChild(this);
		}
		me.Rect.prototype.updateBounds.apply(this);
		this._super(me.Entity, 'update', [dt]);
		return true;
	}
});

game.RockSEntity = me.Entity.extend({
	init: function() {},
	update: function() {}
});

game.RockBEntity = me.Entity.extend({
	init: function() {},
	update: function() {}
});

game.BulletEntity = me.Entity.extend({
	init: function() {

	},
	update: function() {}
});

game.FuelEntity = me.Entity.extend({
	init: function () {},
	update: function() {}
});

game.EnemiesGenerator = me.Renderable.extend({
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
		this.alwaysUpdate = true;
		this.generate = 0;
		this.frequency = 250;
	},
	update: function(dt) {
		if(this.generate++ % this.frequency == 0) {
			var posX = Number.prototype.random(game.data.groundWidth, game.data.width - game.data.groundWidth - 32);
			var enemy = new me.pool.pull('enemyV', posX, 0);
			me.game.world.addChild(enemy, 11);
		}
		this._super(me.Entity, 'update', [dt]);
		return true;
	}
});

game.RocksGenerator = me.Entity.extend({
	init: function() {},
	update: function() {}
});

game.FuelGenerator = me.Entity.extend({
	init: function() {},
	update: function() {}
});

///**
// * Player Entity
// */
//game.PlayerEntity = me.Entity.extend({
//
//    /**
//     * constructor
//     */
//    init:function (x, y, settings) {
//        // call the constructor
//        this._super(me.Entity, 'init', [x, y , settings]);
//    },
//
//    /**
//     * update the entity
//     */
//    update : function (dt) {
//
//        // apply physics to the body (this moves the entity)
//        this.body.update(dt);
//
//        // handle collisions against other shapes
//        me.collision.check(this);
//
//        // return true if we moved or if the renderable was updated
//        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
//    },
//
//   /**
//     * colision handler
//     * (called when colliding with other objects)
//     */
//    onCollision : function (response, other) {
//        // Make all other objects solid
//        return true;
//    }
//});
