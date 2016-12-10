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
            //@x = 330 - (20 + Math.sin(@count * 0.2) * 10)
            this.count = (this.count + 1) % (10 * Math.PI)
          }
        }
      });

      game = new Drawable({
        listeners: {
          ondraw: function(ctx) {
            ctx.rect(0, 0, 800, 600)
            ctx.fillStyle = "#000"
            ctx.fill()
          }
        }
      });

      game.addAsset(one);

      Framework.addScene(game);
    }
  }
})();
