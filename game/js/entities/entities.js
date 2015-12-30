/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        settings = settings || {};
		settings.image = me.loader.getImage('player-32x32');
		settings.width = 32;
		settings.height = 32;
		settings.framewidth = 32;
		settings.frameheight = 32;

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

		this.speed = 2.0;
		this.body.gravity = 0;
		

		this.collided = false;
    },

    /**
     * update the entity
     */
    update : function (dt) {

		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		if(me.input.isKeyPressed('left')) {
			this.pos.x -= me.timer.tick * this.speed;
		} else if(me.input.isKeyPressed('right')) {
			this.pos.x += me.timer.tick * this.speed;
		} else if(me.input.isKeyPressed('fire')) {

		}
		me.Rect.prototype.updateBounds.apply(this);



        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});
