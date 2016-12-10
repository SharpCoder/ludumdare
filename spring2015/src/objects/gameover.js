module.exports = new Drawable({
  image: 'gameover.png',
  gravity: false,
  name: 'gameover',
  scale: 1.0,
  listeners: {
    onreset: function() {
      Framework.UpdateCamera(0,0,0,0,800,800);

    },
    onmousedown: function() {
      window.location.reload();
    },
    onload: function() {

      this.addAsset(new Drawable({
        fontColor: "#000",
        x: 400,
        y: 400,
        scale: 1.0,
        gravity: false,
        listeners: {
          onload: function() {
            var score = Framework.GetScore();
            var witty = [];
            if ( score < 5 ) {
              witty = [
                'You uh, aren\'t very good at this huh?',
                'Try try again.',
                'Really? That\'s it?!',
                'Oh come on, try one more time!'
              ];
              } else if ( score < 10 ) {
              witty = [
                  'My mom could do better than that!',
                  'Your mom could do better than that!',
                  'A whale could do better than that!'
                ];
              } else if ( score < 15 ) {
                witty = [
                  'Not too shabby.',
                  'Keep em\' coming!',
                  'Not good enough!'
                ];
              } else if ( score < 50 ) {
                witty = [
                  'Reasonable.',
                  'Reasonable. Said no one ever!',
                  'I bet you can\t get 51.'
                ];
              } else {
                witty = [
                  'I ran out of witty comments.',
                  'You did amazing!',
                  'Sweet!',
                  'Congratz!'
                ];
              }

              this.witty = witty;
              this.index = Math.round(Math.random() * (witty.length-1));

          },
            onupdate: function() {

                this.text= Framework.GetScore();
            },
            ondraw: function(ctx) {
              var score = Framework.GetScore();
              ctx.fillStyle = "#000";
              ctx.font = "32pt 'Indie Flower'";
              ctx.fillText("You killed " + Framework.GetScore() + " Zombies!", 100,200);
              ctx.fillText(this.witty[this.index], 100, 260);
              ctx.fillText("Click anywhere to retry!", 100, 700);
        }
      }
    }));
  }
}
});
