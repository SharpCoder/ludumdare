// 2014-08-22
// SharpCoder
// This is the scene definition for my ludum dare 30 entry.

Scenes = (function() {

	return {
		Reset: function() {

		},
		Initialize: function() {

			// Setup the initial game context.
			// Context is a global data structure designed to keep track of top-level
			// game variables.
			Scenes.Reset();

			(function() {
				var SFX_VOLUME = 0.4;
				var LEVELS = [
					1,
					5,
					25,
					35
				];
				var eGameState = {
					Intro: 0,
					Running: 1,
					Finished: 2,
					GameOver: 3
				};

				function dist(x,y,x2,y2) {
					// This function is OPTIMIZED. DO NOT CHANGE EVER
					// ANY CODE BELOW THIS LINE!!!!!!!!!
					//if ( Math.abs(y2 - y) < radius + 10 && Math.abs(x2 - x) < radius + 10)
					 	//return 10;
					return Math.sqrt( ((x2 - x) * (x2 - x)) + ((y2 - y) * (y2 - y)) );
				}

				function generateArcEnemy(game, player) {
					return new Drawable({
						x: 0,
						y: 0,
						//vy: -1,
						listeners: {
							onload: function() {
								//this.x = Math.random() * 800;
								//this.y = 800;
								this.opacity = 1.0;
								this.x = Math.random() < 0.5 ? Math.random() * 200 + 800 : -200;
								this.y = Math.random() * 800;
								this.arcs = [];
								var count = 3 * Math.random() + 2;
								for(var i = 0; i < count; i++) {
									this.arcs[i] = {
										startAngle: Math.random() * (Math.PI * 2),
 										length: Math.random() * (Math.PI) + 2,
										color: [~~(Math.random() * 100 + 155), ~~(Math.random() * 100 + 155), ~~(Math.random() * 100 + 155)].join(',')
									};
								}
							},
							onupdate: function() {


								var theta = Math.atan2(this.y - player.y, this.x - player.x);
								var uX = Math.cos(theta);
								var uY = Math.sin(theta);
								this.vx = -uX * 3;
								this.vy = -uY * 3;
								var flakes = game.getAssetsInQuadrant(this.quadrant);
								var self = this;

								if ( game.state !== eGameState.Running ) {
									if ( this.opacity > 0 ) {
										this.opacity -= 0.01;
										this.vy = 0.1;
									} else {
										game.removeAsset(this);
									}
								}

								flakes.forEach(function(flake, index) {
									if ( flake.name !== 'player' && flake.name !== 'pew' && flake.name !== 'snowflake' ) return;

									if ( ~~dist(flake.x, flake.y, self.x, self.y) <= 10 + game.mass + self.arcs.length * 5 ) {

										if ( flake.name === 'player' ) {
											game.addAsset( generateMessage(game, flake.x, flake.y, "ASPLODE!", true));
											game.removeAsset(self);
											game.mass = Math.max(1, game.mass - self.arcs.length * 2);
											Assets.PlayInstant('player_hit.wav', SFX_VOLUME);
											flake.hit = 50;
										} else if (flake.name === 'pew' ) {
											Assets.PlayInstant('enemy_hit.mp3', SFX_VOLUME);
											game.addAsset( generateMessage(game, flake.x, flake.y, "ASPLODE!", true));
											self.arcs.pop();
											if(self.arcs.length <= 1) {
												if(Math.random() < 0.2)
													Assets.PlayInstant('enemy_death_x.wav', SFX_VOLUME);
												else
													Assets.PlayInstant('enemy_death_short_x.wav', SFX_VOLUME);

												game.removeAsset(self);
											}

											game.removeAsset(flake);
										} else {
											flake.doInvoke('myinit');
										}
									}
								});


								this.arcs.forEach(function(arc, i) {
									arc.startAngle = arc.startAngle + (Math.random() * 0.1) * ((i & 1) ? 1 : -1);
								});
							},
							ondraw: function(ctx) {

								for(var i = 0; i < this.arcs.length; i++) {
										var arc = this.arcs[i];
										ctx.strokeStyle = 'rgba(' + arc.color + ',' + this.opacity + ')';
										ctx.beginPath();
										ctx.arc(this.x, this.y, i * 5, arc.startAngle, arc.startAngle + arc.length, false);
										//ctx.closePath();
										ctx.stroke();
								}
							}
						}
					});
				}

				function generateLevelIcon(game, player, callback) {
					return new Drawable({
						x: player.x,
						y: player.y,
						image: 'leveled-up-1.png',
						ox: -16,
						oy: -16,
						listeners: {
							onload: function() {
								this.timer = this.speed = 30;
							},

							onupdate: function() {
								this.x = player.x;
								this.y = player.y;
								this.scale = 0.45 + (this.speed - this.timer--) / this.speed;
								this.ox = this.oy = -(this.width / 2) * this.scale;
								if(this.scale > 1.5) {
									callback.call(player);
									game.removeAsset(this);
								}
							}
						}
					});
				}
				function generateMessage( game, x, y, text, important) {
					return new Drawable({
						x: x,
						y: y,
						text: text,
						vy: -3.5,
						font: "12pt 'Josefin Sans'",

						listeners: {
							onload: function() {
								this.timer = 100;
							},
							onupdate: function() {
								var color = important ? '255,170,0' : '255,255,255';
								this.fontColor = 'rgba(' + color + ',' + (this.timer / 200) + ')';
								if ( this.timer > 0 ) {
									this.timer--;
									return;
								} else if ( this.timer == 0 ) {
									game.removeAsset( this );
								}
							}
						}
					});
				}

				function generateSnowflake( game ) {
					return new Drawable({
						name: 'snowflake',
						x: 800 * Math.random(),
						y: 800 * Math.random(),
						vy: -5,
						listeners: {
							onload: function() {
								this.seed = Math.random();
								this.seed2 = Math.random();
								this.vy = (Math.random() + 1) * -2;
							},
							myinit: function() {
								this.x = -100 + Math.random() * 900;
								this.seed = Math.random();

								if ( this.vy > 0 ) {
									this.y = -(Math.random() * 200);
								} else {
									this.y = 800 + (Math.random() * 200);
									this.vy = ((Math.random() + 1) * -2) / ( game.MAX_ALTITUDE / (game.altitude + 1));
								}
							},
							onupdate: function() {
								var mass = 0.05 + this.seed;
								this.text = this.quadrant;
								if ( game.altitude <= 0 ) {
									this.vy = Math.min( this.vy + 0.05, 5);
								}

								// if ( game.state === eGameState.Running ) {
								// 	var player = game.getAsset('player');
								// 	var collidables = game.getAssets('enemy').concat(player);
								// 	for(var i = 0; i < collidables.length; i++) {
								// 		if ( dist(this.x, this.y, collidables[i].x, collidables[i].y, game.mass) < 10 + game.mass ) {
								// 			//if(collidables[i])
								// 			collidables[i].doInvoke('onsnowflakehit', this, mass);
								// 			this.doInvoke('myinit');
								// 			return;
								// 		}
								// 	}
									/*
									if ( dist(this.x, this.y, player.x, player.y, game.mass) < 10 + game.mass ) {
										game.addAsset( generateMessage( game, this.x, this.y, "+" + mass.toFixed(1) + " Mass"));
										game.mass = Math.min( 50, game.mass + mass);
										this.doInvoke('myinit');
										return;
									}*/
								//}

								this.vx = Math.sin( 0.00005 * (this.seed - this.seed2) * (this.y * 180) / Math.PI );

								if ( this.y < 0 || this.y > 800 ) {
									this.doInvoke("myinit");
								}
							},
							ondraw: function( ctx ) {
								if ( !this.visible ) return;
								var radius = 2 * this.seed;
								ctx.beginPath();
								ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
								ctx.fillStyle = 'white';
								ctx.fill();
								ctx.closePath();
							}
						}
					});
				}
				function generateLaserBeam(game, player, theta, velocity) {

					return new Drawable({
						name: 'pew',
						x: player.x,
						y: player.y,
						vx: Math.cos(theta) * velocity,
						vy: Math.sin(theta) * velocity,
						text: 'pew',
						fontColor: 'red',
						listeners: {
							onupdate: function() {
								if(this.y > 800) {
									game.removeAsset(this);
								}
							}
						}
					});
				}

				var game = new Drawable({
					listeners: {
						onmousedown: function(x, y) {
							var player = this.getAsset('player');
							var theta = Math.atan2(y - player.y, x - player.x);
							if ( this.state === eGameState.Running ) {
								this.addAsset(generateLaserBeam(this, player, theta, 5));
								var audio = 'pew-' + ~~(Math.random() * 3 + 1) + '.mp3';
								Assets.PlayInstant(audio, 0.3);
							}
						},
						onload: function() {
							this.MAX_ALTITUDE = this.altitude = 5000; // meters
							this.mass = 1;
							this.level = 0;
							this.state = eGameState.Intro;
							this.enemySpawnTimer = 100;

							// Create dem snowflakes
							for(var i = 0; i < 600; i++ ) {
								this.addAsset( generateSnowflake(this) );
							}

							var player = new Drawable({
								name: 'player',
								x: 400,
								y: 400,
								image: 'snowman-1.png',
								rotation: 0,
								listeners: {
									onsnowflakehit: function(snowflake, mass) {
										game.addAsset( generateMessage( game, this.x, this.y, "+" + mass.toFixed(1) + " Mass"));
										game.mass = Math.min( 250, game.mass + mass);
										//this.hit = 100;
									},
									onload: function() {
										this.current_arc_r = 0;
										this.hit = 0;
										this.popped = false;
									},
									onmousemove: function(x,y) {
										if ( this.visible && game.state === eGameState.Running) {
											this.vx = ( x  - this.x ) / 100;
											this.rotation_r = Math.atan2( this.y - y, this.x - x );
											this.rotation = (this.rotation_r * 180) / Math.PI;
										} else {
											this.vx = 0;
										}
									},
									onupdate: function() {
										if(game.state > eGameState.Running) {
											// finished dawg
											if(this.y > 650) {
												if(!this.popped) {
													Assets.Play('pop.wav');
													this.popped = true;
												}
												this.vy = 0;
											}
											else {
												this.vy = 2;
											}
											return;
										}
										if ( this.visible ) {
											this.y = 400 - ( this.height / 2);
										}

										if ( game.state === eGameState.Running ) {
												var flakes = game.getAssetsInQuadrant(this.quadrant);
												var self = this;
												flakes.forEach(function(flake, index) {
													if(  flake.name !== 'snowflake' ) return;
													if ( ~~dist(flake.x, flake.y, self.x, self.y, 100) <= 10 + game.mass ) {
														flake.doInvoke('myinit');
														self.doInvoke('onsnowflakehit', flake, 0.01 + flake.seed);
													}
												});
										}
										var levelMass = LEVELS[game.level];
										var nextLevelMass = LEVELS[game.level+1] || 999999999;

										if(game.mass >= nextLevelMass) {
											Assets.Play('fanfare.wav', SFX_VOLUME);
											game.level++;
											this.visible = false;
											game.addAsset(generateLevelIcon(game, this, function() {
												this.visible = true;
												this.image = null;
											}));
											game.addAsset(generateMessage(game, this.x, this.y, 'Level up!', true));
										}
										else if(game.mass < levelMass) {
											game.level--;
											this.visible = false;
											game.addAsset(generateLevelIcon(game, this, function() {
												this.visible = true;
												this.image = null;
											}));
											game.addAsset(generateMessage(game, this.x, this.y, 'Level down!', true));
										}

										/*
										if (game.mass < 1 && game.level !== 1) {
											this.visible = false;
											game.addAsset(generateLevelIcon(game, this, function() {
												this.visible = true;
												this.image = null;
											}));
											game.addAsset(generateMessage(game, this.x, this.y, 'Level up!', true));
											game.level = 1;
										}
										else if (game.mass < 15 && game.level !== 2) {
											this.visible = false;
											game.addAsset(generateLevelIcon(game, this, function() {
												this.visible = true;
												this.image = null;
											}));
											game.addAsset(generateMessage(game, this.x, this.y, 'Level up!', true));
											game.level = 2;
										}*/

									},
									ondraw: function( ctx ) {
										var color;

										if(this.hit > 0) {
											color = ((--this.hit) % 10) ? '255,0,0' : '255,255,255';
										}
										else {
											color = '244,249,255';
										}
										this.visible = (game.state >= eGameState.Running);
										if(!this.visible)
											return;

										var radius = 5 + (game.mass);
										// draw the player (snowman)
										[
											// the image snowflake thingy
											function() {
												ctx.beginPath();
												ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
												ctx.fillStyle = 'rgba(' + color + ',0.4)';
												ctx.fill();
												ctx.closePath();
											},

											// the ball
											function() {
												ctx.beginPath();
												// create radial gradient
												var offset = radius/5;
												var grd = ctx.createRadialGradient(this.x + offset, this.y - offset, 0, this.x + offset, this.y - offset, radius * 1.5);
												grd.addColorStop(0, 'rgb(' + color + ')');
												grd.addColorStop(1, '#ADD3FF');
												ctx.fillStyle = grd;

												ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);

												ctx.fill();
												ctx.closePath();
											},

											// THE BALLLLLSSS (because I'm immature)
											function() {
												var offset = radius/5;


												var secondRadius = radius / 1.4;
												// first ball
												ctx.beginPath();
												var grd = ctx.createRadialGradient(this.x + offset, this.y - offset, 0, this.x + offset, this.y - offset, radius * 1.5);
												grd.addColorStop(0, 'rgb(' + color + ')');
												grd.addColorStop(1, '#ADD3FF');
												ctx.fillStyle = grd;
												ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
												ctx.fill();
												ctx.closePath();

												// second upper ball
												ctx.beginPath();
												grd = ctx.createRadialGradient(this.x + offset, this.y - offset - radius - secondRadius + 15, 0, this.x + offset, this.y - offset- radius - secondRadius + 15, radius * 2);
												grd.addColorStop(0, 'rgb(' + color + ')');
												grd.addColorStop(1, '#ADD3FF');
												ctx.fillStyle = grd;
												ctx.arc(this.x, this.y - radius - secondRadius + 15, secondRadius, 0, 2 * Math.PI, false);
												//ctx.fillStyle = 'rgb(' + color + ')';
												ctx.fill();
												ctx.closePath();
											},

											function() {
												var offset = radius/5;


												var secondRadius = radius / 1.4;
												// first ball
												ctx.beginPath();
												var grd = ctx.createRadialGradient(this.x + offset, this.y - offset, 0, this.x + offset, this.y - offset, radius * 1.5);
												grd.addColorStop(0, 'rgb(' + color + ')');
												grd.addColorStop(1, '#ADD3FF');
												ctx.fillStyle = grd;
												ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
												ctx.fill();
												ctx.closePath();

												// second upper ball
												ctx.beginPath();
												grd = ctx.createRadialGradient(this.x + offset, this.y - offset - radius - secondRadius + 15, 0, this.x + offset, this.y - offset- radius - secondRadius + 15, radius * 2);
												grd.addColorStop(0, 'rgb(' + color + ')');
												grd.addColorStop(1, '#ADD3FF');
												ctx.fillStyle = grd;
												ctx.arc(this.x, this.y - radius - secondRadius + 15, secondRadius, 0, 2 * Math.PI, false);
												//ctx.fillStyle = 'rgb(' + color + ')';
												ctx.fill();
												ctx.closePath();

												// draw dem eyes gurl
												ctx.fillStyle = '#111';
												ctx.beginPath();
												ctx.arc(this.x - 15, this.y - radius - secondRadius + 15, 5, 0, 2 * Math.PI, false);
												ctx.arc(this.x + 15, this.y - radius - secondRadius + 15, 5, 0, 2 * Math.PI, false);
												ctx.fill();
												ctx.closePath();

											}
										][~~game.level].call(this);

										// Draw the Arc for the weapon.
										var theta = Math.PI / 8; // This line calculates a theta.
										ctx.strokeStyle = 'rgba(255, 68, 68, 0.4)';
										ctx.lineWidth = 3;
										ctx.beginPath();


										if ( this.state === eGameState.Running ) {
											this.current_arc_r = this.rotation_r;
											ctx.arc(this.x, this.y, radius + 15, Math.PI + this.current_arc_r - theta, Math.PI + this.current_arc_r + theta, false);
											ctx.stroke();
										}
									}
								}
							});

							this.addAsset( new Drawable({
								x: 400,
								y: 650,
								width: 300,
								height: 40,
								text: 'Begin Simulation',
								font: "32pt 'Josefin Sans'",
								fontColor: '#FA0',
								listeners: {
									onmousemove: function( x, y ) {
										if ( this.isCollided(x,y)) {
											document.querySelector("canvas").style.cursor = 'pointer';
											this.fontColor = '#99CC00';
										} else {
											document.querySelector("canvas").style.cursor = 'default';
											this.fontColor = '#FA0';
										}
									},
									onmousedown: function ( x, y ) {
										if ( this.isCollided( x, y) ) {
											this.vy = game.getAsset('title').vy = -4;
										}
									},
									onupdate: function() {
										if ( game.state === eGameState.Intro && this.y < 0 && this.visible ) {
											this.visible = false;
											game.state = eGameState.Running;
										}
									}
								}
							}));

						// GAME-ELEMENT - Title
						this.addAsset( new Drawable({
								name: 'title',
								text: 'Snowman Simulator 2014',
								x: 400,
								y: 600,
								font: "24pt 'Josefin Sans'",
								listeners: {
									onupdate: function() {
										if ( game.state !== eGameState.Intro && this.y < 0 ) {
											this.visible = false;
										}
									}
								}
							}));

							// HUD-ELEMENT - Altitude
							this.addAsset( new Drawable({
								text: 'Altitude: -m',
								x: 680,
								y: 30,
								fontColor: 'rgba(255, 255, 255, 0)',
								listeners: {
									onload: function() {
										this.opacity = 0;
									},
									onupdate: function() {
										this.visible = (game.state === eGameState.Running);

										if(this.visible) {
											this.text = 'Altitude: ' + game.altitude + 'm';
											this.opacity = Math.min(1, this.opacity + 0.1);
											this.fontColor = 'rgba(255, 255, 255, ' + this.opacity + ')';
										}
									},

									ondraw: function(ctx) {
										//var m = ctx.measureText(this.text);
										//this.x = 780 - m.width;
									}
								}
							}));

							// HUD-ELEMENT - Minimap
							this.addAsset( new Drawable({
								x: 780,
								y: 40,
								height: 150,
								width: 10,
								listeners: {
									onload: function() {
										this.opacity = 0;
									},
									onupdate: function() {

										this.visible = (game.state === eGameState.Running);
										if(this.visible) {
											this.opacity = Math.min(1, this.opacity + 0.01);
											this.color = 'rgba(255, 255, 255, ' + this.opacity + ')';
										}
									},
									ondraw: function(ctx) {
										if(!this.visible)
											return;
										ctx.fillStyle = this.color;
										var offset = ((game.MAX_ALTITUDE - game.altitude) / game.MAX_ALTITUDE) * this.height;
										ctx.fillRect(this.x + (this.width/2), this.y, this.width, 1);
										ctx.fillRect(this.x + this.width/2, this.y, 1, this.height);
										ctx.fillRect(this.x + (this.width/2), this.y + this.height, this.width, 1);

										// draw the triangle yo
										ctx.fillStyle = '#fa0';
										ctx.beginPath();
										ctx.moveTo(this.x, this.y + offset - 5);
										ctx.lineTo(this.x + 5, this.y + 5 + offset - 5);
										ctx.lineTo(this.x, this.y + 10 + offset - 5);
										ctx.lineTo(this.x, this.y + offset - 5);
										ctx.closePath();
										//ctx.stroke();
										ctx.fill();
									}
								}
							}));

							// HUD-ELEMENT - Mass
							this.addAsset( new Drawable({
								x: 20,
								y: 30,
								text: 'Mass: 0g',
								listeners: {
									onload: function() {
										this.opacity = 0;
									},
									onupdate: function() {
										this.visible = (game.state === eGameState.Running);
										if (this.visible) {
											this.text = 'Mass: ' + game.mass.toFixed(2) + 'g';
											this.opacity = Math.min(1, this.opacity + 0.1);
											this.fontColor = 'rgba(255, 255, 255, ' + this.opacity + ')';
										}
									}
								}
							}));
							this.addAsset( new Drawable({
								x: 20,
								y: 50,
								text: 'Level: 0',
								listeners: {
									onload: function() {
										this.opacity = 0;
									},
									onupdate: function() {
										this.visible = (game.state === eGameState.Running);
										if (this.visible) {
											this.text = 'Level: ' + game.level;
											this.opacity = Math.min(1, this.opacity + 0.1);
											this.fontColor = 'rgba(255, 255, 255, ' + this.opacity + ')';
										}
									}
								}
							}));

							this.addAsset( player );
						},
						onupdate: function() {
							if ( this.state === eGameState.Running ) {
								this.altitude -= 5;

								if ( this.enemySpawnTimer-- < 0 ) {
									var player = this.getAsset('player');
									this.enemySpawnTimer = (Math.random() * 20 + 90) / (game.level || 1);
									// blah
									this.addAsset(generateArcEnemy(this, player));
								}

								var text;
								if(this.altitude < 0) {
									var player = this.getAsset('player');
									// fall onto ground, hat should plop on it
									this.state = eGameState.Finished;

									if(this.level >= 2) {
										// you are a winrar winzip 7zip yo
										this.addAsset(new Drawable({
											image: 'snowman-glasses.png',
											x: player.x + ( 15 + game.mass ) / 2 - 49,
											y: -50,
											vy: 3.1,
											rotation: 0,
											listeners: {
												onupdate: function() {
													this.rotation = (Math.sin( this.y / 65 ) + 2 * Math.PI ) * 185;
													var r = ( 31 + game.mass) * 1.8;
													if ( this.y >= player.y - r + 60 && this.vy ) {
														this.vy = 0;
														Assets.Play('pop.wav');
													}
												}
											}
										}));

										this.addAsset( new Drawable({
											image: 'snowman-hat.png',
											x: player.x + (10 + game.mass)/2 - 32,
											vy: 2,
											y: -32,
											rotation: 0,
											listeners: {
												onupdate: function() {
													this.rotation = (Math.sin( this.y / 80 ) + 2 * Math.PI) * 110;
													var r = (21 + game.mass) * 1.8; // 2.4
													if(this.y >= player.y - r && this.vy) {
														this.vy = 0;
														Assets.Play('pop.wav');
													}
												}
											}
										}));

										var rand = Math.random();
										if ( rand > 0.7 )
											text  = ['You are a winrar!'];
										else if ( rand > 0.4 )
											text  = ['Congratulations!'];
										else
											text  = ['You did well, my child.'];

										text = text.concat('You grew to ' + game.mass.toFixed(2) + ' grams at level ' + ~~game.level + '!');
									} else {
										text =  ['You have failed to grow up, child!'];
									}


									for(var i = 0; i < text.length; i++ ) {
										var txt = text[i];
										this.addAsset( new Drawable({
											text: txt,
											name: (i + 1).toString(),
											y: -200 + (i * 40),
											vy: 3,
											font: (i == 0 ? '32pt ' : '16pt ') + "'Josefin Sans'",
											fontColor: (i == 0 ? '#000F26' : '#BC0009'),
											listeners: {
												onupdate: function() {
													if ( this.y > (300 + (parseFloat(this.name) * 50)))
													this.vy = 0;
												},
												ondraw: function(ctx) {
													ctx.font = this.font;
													this.x = 400 - (ctx.measureText(this.text).width / 2);
												}
											}
										}));
									}

									this.addAsset( new Drawable({
										x: 600,
										y: 650,
										width: 150,
										height: 40,
										text: 'Restart?',
										font: "32pt 'Josefin Sans'",
										fontColor: '#FA0',
										listeners: {
											onmousemove: function( x, y ) {
												if ( this.isCollided(x,y)) {
													document.querySelector("canvas").style.cursor = 'pointer';
													this.fontColor = '#99CC00';
												} else {
													document.querySelector("canvas").style.cursor = 'default';
													this.fontColor = '#000';
												}
											},
											onmousedown: function ( x, y ) {
												if ( this.isCollided(x,y)) {
													window.location.reload();
												}
											}
										}
									}));
								}
							}
						},
						ondraw: function( ctx ) {

							var my_gradient = ctx.createLinearGradient(0, -400, 0, 800 + this.altitude - 100);
							my_gradient.addColorStop( 0, "#000F26" );
							my_gradient.addColorStop( 1, "#EDF2FF" );
							ctx.fillStyle = my_gradient;
							ctx.fillRect(0, 0, 800, 800);

						}
					}

				});

				Assets.Play('bg_loop.mp3', 0.8, true);
				Framework.AddScene( game );

			})();


		}
	};

})();
