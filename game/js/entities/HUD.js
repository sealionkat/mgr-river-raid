game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({

  init: function () {
    this._super(me.Container, 'init');
    this.isPersistent = true;
    this.floating = true;
    this.name = 'HUD';
    this.type = 'hud';
    this.addChild(new game.HUD.ScoreItem(5, 5));
  }
});

game.HUD.ScoreItem = me.Renderable.extend({
  init: function (x, y) {
    this._super(me.Renderable, 'init', [x, y, 10, 10]);
    this.font = new me.Font('Arial', 20, 'black');
    this.score = -1;
  },
  update: function () {
    if (this.score !== game.data.score) {
      this.score = game.data.score;

      return true;
    }

    return false;
  },
  draw: function (context) {
    this.font.draw(context, 'Score: ' + game.data.score, this.pos.x, this.pos.y);
    this.font.draw(context, 'Fuel: ' + game.data.fuel, this.pos.x, this.pos.y + 25);
  }

});
