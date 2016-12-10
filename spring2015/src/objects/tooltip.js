module.exports = {
  GenerateTooltip: function(title, text, icon, x, y) {
    return new Drawable({
      x: x,
      y: y,
      gravity: false,
      listeners: {
        ondraw: function(ctx) {

          var size = ctx.measureText( text );
          ctx.fillRect( this.x, this.y, size.x + 20, 50 );

        }
      }
    });
  }
};
