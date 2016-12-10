Scenes = (function() {
  return {
    Initialize: function() {

      one = new Drawable({
        image: "ball.png",
        count: 0,
        x: 220,
        y: 200,
        listeners: {
          onupdate: function() {
            this.scale = 20 + Math.sin(this.count * 0.2) * 10

            var newCount = (this.count + 1) % (10 * Math.PI);
            if (newCount < this.count) {
              this.count = 0;
            } else {
              this.count = newCount;
            }
          }
        }
      });

      game = new Drawable({
        listeners: {
          ondraw: function(ctx) {
            //ctx.clearRect(0, 0, 800, 800);
            //ctx.save();
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = "#000";
            ctx.fill();
            //ctx.restore();
          }
        }
      });

      game.addAsset(one);

      Framework.addScene(game);
    }
  }
})();
