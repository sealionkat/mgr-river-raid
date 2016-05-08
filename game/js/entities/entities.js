game.PlayerEntity = me.Entity.extend({
	init: function() {},
	update: function() {},
	onCollision: function() {}
});

game.Ground = me.Entity.extend({
	init: function() {},
	update: function() {}
});

game.EnemyVEntity = me.Entity.extend({
	init: function() {},
	update: function() {}
});

game.EnemyHEntity = me.Entity.extend({
	init: function() {

	},
	update: function() {}
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

game.EnemiesGenerator = me.Entity.extend({
	init: function() {

	},
	update: function() {}
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
