// 2014-08-23
// SharpCoder
// This is the main menu screen.

MainMenu = function() { 
	var music = Assets.GetAudio("happy.wav");

	return new Drawable({
		name: 'menu',
		image: 'game_menu.png',
		listeners: {
			onreset: function() {
				this.countdown = undefined;
				music.volume = 0.7;
				music.loop = true;
				music.play();
			},
			onmousemove: function(x,y) { 
				var hovered = false;
				for ( var i = 0; i < this.assets.length; i++ ) { 
					if ( this.assets[i].name === "item" && this.assets[i].isCollided(x,y))
						hovered = true;
				}

				document.body.style.cursor = (hovered) ? "pointer": "default";
			},
			onload: function() {
				var index = 0;
				function createOptions(text, action) { 
					var option = new Drawable({
						name: "item",
						text: text,
						x: 310,
						y: 540 + (120 * index++),
						font: "48pt 'Francois One'",
						fontColor: "#00BA65",
						width: 150,
						height: 60,
						listeners: {
							onload: function() {
								this.action = action;
							},
							onmousedown: function( x, y) {
								if ( this.isCollided(x,y) ) {
									if ( this.action !== undefined && this.action !== null && this.countdown === undefined ) {
										Assets.Play("begin.wav");
										this.countdown = 80;
									}
								}
							},
							onmousemove: function( x, y ) { 
								if ( this.isCollided(x,y) ) {
									this.fontColor = "#ffffff";
								} else {
									this.fontColor = "#00BA65";
								}
							},
							onupdate: function() {
								if ( this.countdown === undefined || (this.countdown && this.countdown-- > 0) ) return;

								music.pause();
								this.action.call(this);
							}
						}
					});
					this.addAsset(option);
				}	

				createOptions.call(this, "Start", function() { Framework.LoadScene("level1"); });

				this.addAsset(new Drawable({ x: 220, y: 110, text: "Space Vikings", font: "42pt 'Francois One'", fontColor: "#ffffff" }));

			}
		}
	});
};