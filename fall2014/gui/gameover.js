// 2014-08-23
// SharpCoder
// This is the game over screen.
GameOver = function() {
	var theme = Assets.GetAudio('death_theme.wav');
	var msg = "";
	var secondary = "";

	return new Drawable({
		name: 'GameOver',
		image: 'game_over.png',
		listeners: {
			onreset: function() {
				theme.volume = 0.7;
				theme.loop = true;
				theme.play();
				msg = Framework.GetContext().Message;
				secondary = "You survived " + Framework.GetContext().Turn + " weeks of battle!";
			},
			onload: function() {
				this.addAsset(new Drawable({
					x: 40,
					y: 550,
					font: "24pt 'Dosis'",
					listeners: {
						onupdate: function() {
							this.text = msg;
						}
					}
				}));
				
				this.addAsset(new Drawable({
					x: 40,
					y: 590,
					font: "24pt 'Dosis'",
					listeners: {
						onupdate: function() {
							this.text = secondary;
						}
					}
				}));

				this.addAsset(new Drawable({
					text: 'Retry?',
					font: "36pt 'Dosis'",
					fontColor: '#fff',
					x: 340,
					y: 700,
					width: 100,
					height: 36,
					listeners: {
						onmousedown: function( x, y ) {
							if ( this.isCollided( x, y ) ) {
								theme.pause();
								Framework.LoadScene("level1");
							} 		
						},
						onmousemove: function( x, y ) {
							if ( this.isCollided( x, y ) ) {
								this.fontColor = "#00BA65";
								document.body.style.cursor = "pointer";
							} else {
								this.fontColor = "#fff";
								document.body.style.cursor = "default";
							}
						}
					}
				}));
			}
		}
	});
}