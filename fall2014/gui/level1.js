// 2014-08-23
// SharpCoder
// This is the primary game screen.

Level1 = function() {
	var background_music = Assets.GetAudio("tavern.wav");
	return new Drawable({
		name: 'level1',
		image: 'space.png',
		listeners: {
			onreset: function() {
				Framework.SetContext({
					Turn: 1,
					Message: "Your ship explodes during the battle, there are no survivors..",
					HP: 6,
					Earth: 100,
					MAX_HEALTH: 6,
					Upgrades: {
						Weapons: 1,
						Crew: 1,
						Shields: 1,
						Level: 1
					},	
					Resources: {
						Land: 0,
						Food: 16,
						Metal: 0
					}
				});

				delete this.assets;
				this.assets = new Array();
				this.doInvoke("onload");

				Assets.PlayAudio( background_music, 0.25, true );
			},
			onmousemove: function(x,y) { 
				var hovered = false;
				for ( var i = 0; i < this.assets.length; i++ ) { 
					if ( (this.assets[i].name === "action" || this.assets[i].name == "speaker") && this.assets[i].isCollided(x, y - this.assets[i].image.height))
						hovered = true;
				}

				document.body.style.cursor = (hovered && !this.scenic) ? "pointer": "default";
			},
			onload: function() {
				
				var self = this;
				var context = Framework.GetContext();

				// Play the background music.
				function end_turn() {
					context.Turn++;
					mod_food(-1 * context.Upgrades.Crew);
					flashResource("Food", "#FFFF00");
					Framework.SetContext(context);
				}

				function mod_metal(delta) {

					context.Resources.Metal += delta;

					if ( delta < 0 ) {
						flashResource("Metal", "#FF0000");
					} else {
						flashResource("Metal", "#00BA65")
					}
				}

				function mod_health(delta) {
					context.HP += delta;
					if ( delta < 0 ) {
						if ( context.HP <= 2 ) {
							Assets.Play("shields_low.wav", 0.8);
						}
					}

					// Check for lose condition.
					if ( context.HP < 0 ) {
						context.Message = "Your ship explodes during the battle, there are no survivors.";
						background_music.pause();
						Framework.SetContext(context);
						Framework.LoadScene("GameOver");
					}
				}

				function mod_food(delta) {
					context.Resources.Food += delta;
					if ( delta < 0 ) {
						if ( context.Resources.Food <= 3 * context.Upgrades.Crew && context.Resources.Food > context.Upgrades.Crew) {
							Assets.Play("food_low.wav", 0.8);
						} else if ( context.Resources.Food == 1 * context.Upgrades.Crew ) {
							Assets.Play("starving_to_death.wav", 0.8);
						}
					}

					// Check for the lose condition.
					if ( context.Resources.Food < 0 ) {
						context.Message = "Your crew died of starvation. There are no survivors.";
						background_music.pause();
						Framework.SetContext(context);
						Framework.LoadScene("GameOver");
					}
				}

				function enter_scenic_mode() {
					self.velocity = 0;
					self.scenic = true;
					self.move_hud = true;
					self.move_hud_back = false;
				}
				function exit_scenic_mode() {
					self.scenic = false;
					self.velocity = 10;
					self.move_hud_back = true;
					self.move_hud = false;
				}

				function flashResource( resource, color ) {
					hud.flash_resource[resource] = {
						Iteration: 6,
						Counter: 30,
						Flash: false,
						Color: color || "#FF0000"
					};
				}

				function showUpgradeWindow() {
					var asset = new Drawable({
						name: 'upgrade_window',
						x: 100,
						y: 150,
						image: 'upgrade_menu.png',
						listeners: {
							onmousemove: function(x,y) {
								var hovered = false;
								for ( var i = 0; i < this.assets.length; i++ ) { 
									if ( (this.assets[i].name === "action" || this.assets[i].name == "speaker") && this.assets[i].isCollided(x, y - this.assets[i].image.height))
										hovered = true;
								}

								document.body.style.cursor = (hovered && !this.scenic) ? "pointer": "default";
							},
							onload: function() {
								var me = this;
								this.addAsset(new Drawable({
									text: 'Upgrade',
									font: "36pt 'Francois One'",
									fontColor: '#000000',
									x: 510,
									y: 200
								}));

								this.addAsset(new Drawable({
									image: 'longboat.png',
									x: 300,
									y: 250
								}));

								this.addAsset(createAction_custom(-100, 170, 'upgrade_weapon.png', 120, 510, '#000', 'Upgrade your weapon systems, deal more damage!', 
									function(){ 
										Assets.Play("upgrade.wav");
										mod_metal(-30);
										context.Upgrades.Weapons += 1;
										exit_scenic_mode();
										end_turn();
										self.removeAsset(asset);
									}, 
									function() { return (context.Upgrades.Weapons <= context.Upgrades.Level); }
								));

								this.addAsset(createAction_custom(-100, 170 + 70, 'upgrade_crew.png', 120, 510, '#000', 'Hire more crew to collect more resouorces!', 
									function(){ 
										mod_metal(-30);
										context.Upgrades.Crew += 1;
										exit_scenic_mode();
										end_turn();
										self.removeAsset(me);
									}, 
									function() { return (context.Upgrades.Crew <= context.Upgrades.Level); }
								));

								this.addAsset(createAction_custom(-100, 170 + 140, 'upgrade_shield.png', 120, 510, '#000', 'Upgrade your shield technology so you can take more hits!', 
									function(){ 
										mod_metal(-30);
										context.Upgrades.Shields += 1;
										context.MAX_HEALTH++;
										context.HP++;
										exit_scenic_mode();
										end_turn();
										self.removeAsset(asset);										
									}, 
									function() { return (context.Upgrades.Shields <= context.Upgrades.Level); }
								));

								this.addAsset(createAction_custom(-100, 170 + 210, 'upgrade_tier.png', 120, 510, '#000', 'Level Up!', 
									function(){ 
										mod_metal(-30);
										context.Upgrades.Level += 1;
										exit_scenic_mode();
										end_turn();
										self.removeAsset(asset);	
									}, 
									function() { return (context.Upgrades.Shields > context.Upgrades.Level) && (context.Upgrades.Crew > context.Upgrades.Level) && (context.Upgrades.Weapons > context.Upgrades.Level); }
								));
							},
							ondraw: function( ctx ) {
								var upgrades = ["Weapons", "Crew", "Shields", "Level"];
								for ( var i = 0; i < upgrades.length; i++ ) {

									var x = 120 + 64 + 5;
									var y = 215 + (70 * i);

									ctx.font = "24pt 'Francois One'";
									ctx.fillStyle="#000";
									ctx.fillText( context.Upgrades[upgrades[i]], x, y);

								}
							}
						}
					});

					self.addAsset(asset);
				}

				function powerUp(x, y, target, callback, color) {
					color = color || '#00BA65';
					this.addAsset(new Drawable({
						listeners: {
							onload: function() {
								// Create each "particle" in an array.
								var variance = 180;
								var count = 150;
								this.target = target;
								this.particles = new Array();

								for ( var i = 0; i < count; i++ ) {
									var px = x + (Math.random() * variance) - (Math.random() * variance);
									var py = y + (Math.random() * variance) - (Math.random() * variance);
									this.particles.push([px,py,0,0]);
								}	
							},
							onupdate: function() {
								// If we're close to the end, finish it off.
								if ( this.particles.length < 10 ) {
									if ( callback !== undefined && callback !== null ) {
										callback.call(this);
										callback = undefined;
									}
								}

								if ( this.particles.length === 0 ) {
									self.removeAsset(this);
									return;
								}

								// Bring each particle closer to the target asset.
								for ( var i = 0; i < this.particles.length; i++ ) {
									var x = this.particles[i][0];
									var y = this.particles[i][1];
									var dx = this.particles[i][2];
									var dy = this.particles[i][3];

									var gConst = 0.000000001;
									var massT = 1000000000;
									var massP = 50;
									var distance = Math.sqrt(Math.pow(x - this.target.x, 2) + Math.pow(y - this.target.y,2));

									var delta = gConst * ((massT * massP) / Math.pow(distance,2));
									if ( distance < 25 ) {
										// Remove the particle.
										var newlist = new Array();
										for ( var r =0; r < this.particles.length; r++ ) {
											if ( r != i )
												newlist.push(this.particles[r]);
										}

										delete this.particles;
										this.particles = newlist;
										i--;
										break;
									}

									if ( x > this.target.x )
										this.particles[i][2] -= delta;
									else
										this.particles[i][2] += delta;

									if ( y > this.target.y )
										this.particles[i][3] -= delta;
									else
										this.particles[i][3] += delta;

									// Update position based on velocity.
									this.particles[i][0] += this.particles[i][2];
									this.particles[i][1] += this.particles[i][3];
								}
							},
							ondraw: function(ctx) {
								// Iterate over each particle.
								ctx.fillStyle = color;
								for( var i = 0; i < this.particles.length; i++ ) {
									var x = this.particles[i][0];
									var y = this.particles[i][1];

									ctx.fillRect(x,y,3,3);
								}
							}
						}
					}));
				}

				function fireMissile(x, y, callback, vx, dont_beam) {
					dont_beam = dont_beam || false;
					var missile = new Drawable({
						x: x,
						y: y,
						vx: -2 + (vx || 0),
						image: 'missile.png',
						animations: ['explosion_1.png','explosion_2.png','explosion_3.png','explosion_4.png','explosion_5.png','explosion_4.png','explosion_3.png','explosion_2.png','explosion_1.png'],
						gravity_standard: true,
						listeners: {
							onload: function() {
								Assets.Play("pew.wav", 0.6);
							},
							onafteranimation: function() { 
								this.visible = false;
								if ( !dont_beam )
									planetBeam.call(self, callback);
								self.removeAsset(this);
							},
							onupdate: function() {
								if ( !this.visible ) return;
								if ( this.animate ) return;

								var distance = Math.sqrt(Math.pow(this.x - planet.x,2) + Math.pow(this.y - planet.y, 2));
								if ( distance < 100 ) {
									this.animate = true;
									this.animation_count = 1;
									this.gravity_standard = false;
									this.vx = 0;
									this.vy = 0;
									this.ox = -40;
									this.oy = -40;
									Assets.Play('explosion.wav', 0.35);
								}
							}
						}
					});

					this.addAsset(missile);
				}

				function planetBeam( callback ) {
					var beam = new Drawable({
						x: planet.x,
						y: planet.y,
						listeners: {
							onload: function() { 
								this.beam_height = 0;
								this.pre_cooldown = 40;
							},
							onupdate: function() { 
								if ( this.update_disabled ) return;
								if ( this.pre_cooldown-- > 0 ) return;	
								else if ( this.pre_cooldown == -1 ) {
									this.pre_cooldown--;
									Assets.Play("lazer.wav", 0.6);
									return;
								}

								this.beam_height -= 8;
								if ( this.beam_height < -150 ) {
									this.cooldown = 80;
									this.update_disabled = true;
								}
							},
							ondraw: function( ctx ) { 
								if ( !this.visible ) return;
								if ( this.cooldown !== undefined && this.cooldown-- < 0 ) {
									this.visible = false;
									// Show the hud again.
									exit_scenic_mode();
									end_turn();
									if ( callback !== undefined && callback !== null )
										callback.call(this);

									mod_health( -1 * context.Upgrades.Level);
									self.removeAsset(this);
								}

								ctx.fillStyle = "#FF0000";
								ctx.fillRect( this.x, this.y, 5, this.beam_height);
							}
						}
					});

					this.addAsset(beam);
				}

				function createAction(x,y, image, tooltip, action, image_logic) {
					return createAction_custom(x,y,image,220, y-10, '#ffffff', tooltip,action,image_logic);
				}

				function createAction_custom(x, y, image, tooltip_x, tooltip_y, tooltip_color, tooltip, action, image_logic) {
					var image_normal = image.replace("_disabled.png", ".png");
					var image_disabled = image.replace("_disabled.png", ".png").replace(".png", "_disabled.png");

					return new Drawable({
						name: 'action',
						image: image,
						x: 220 + x,
						y: y,
						listeners: {
							onload: function() {
								this.ttip = new Drawable({
									x: tooltip_x,
									y: tooltip_y,
									visible: false,
									text: tooltip,
									fontColor: tooltip_color
								});

								this.action = action;
								this.addAsset(this.ttip);
							},
							onmousedown: function( x, y ) {
								if ( this.parent.scenic ) return;
								if ( image_logic !== undefined && image_logic !== null && !image_logic.call(this))
									return;

								if ( this.isCollided(x, y - this.image.height) ) {
									if ( this.action !== undefined && this.action !== null ) {
										this.action.call(this);
									}
								}
							},
							onupdate: function() {
								if ( this.parent.move_hud || this.parent.move_hud_back ) {
									this.ttip.visible = false;
								}

								if ( image_logic !== undefined && image_logic !== null && image_logic.call(this) ) {
									this.image = Assets.Get(image_normal);
								} else {
									this.image = Assets.Get(image_disabled);
								}
							},
							onmousemove: function( x, y ) {
								if ( this.parent.scenic ) {
									return;
								}

								if ( this.isCollided(x, y - this.image.height ) ) {
									this.ttip.visible = true;
								} else {
									this.ttip.visible = false;
								}
							}
						}
					});
				}

				// Add the hud and everything.
				var hud = new Drawable({
					name: 'hud',
					x: 0,
					y: 0,
					listeners: {
						onload: function(){
							this.flash_resource = { };

							for ( var i = 0; i < context.MAX_HEALTH; i++ ) {
								
								var heart = new Drawable({
									x: 800 - (128 * 0.35 * i) - 50,
									y: 15,
									scale: 0.35,
									image: 'heart.png',
									listeners: {
										onupdate: function() {
											this.ox = hud.ox;
											this.oy = hud.oy;
											if ( this.ind > (context.HP - 1) )
												this.image = Assets.Get('heart_gone.png');
											else
												this.image = Assets.Get('heart.png');
										}
									}
								});

								heart.ind = i;
								this.addAsset(heart);
							}

							for ( var i = 0; i < 5; i++ ) {

								var heart = new Drawable({
									x: 800 - (128 * 0.35 * i) - 50,
									y: 15 + (128 * 0.35),
									scale: 0.35,
									image: 'heart.png',
									visible: false,
									listeners: {
										onupdate: function() {
											this.ox = hud.ox;
											this.oy = hud.oy;
											if ( this.ind < context.MAX_HEALTH) 
												this.visible = true;

											if ( this.ind > (context.HP - 1) )
												this.image = Assets.Get('heart_gone.png');
											else {
												this.image = Assets.Get('heart.png');
											}
										}
									}
								});

								heart.ind = 6 + i;
								this.addAsset(heart);	
							}

						},
						ondraw: function( ctx ) {
							ctx.font = "18pt 'Dosis'";

							// Render the resources.
							var resources = ["Land", "Food", "Metal"];
							for ( var i = 0; i < resources.length; i++ ) {

								var flash = false;
								var color = "#FFFFFF";

								for ( var prop in this.flash_resource )  {
									if ( prop === resources[i] ) {
										flash = this.flash_resource[prop].Flash;
										color = this.flash_resource[prop].Color;

										// Check if we need to flash.
										if ( this.flash_resource[prop].Iteration > 0 ) {
											if ( this.flash_resource[prop].Counter-- <= 0 ) { 
												this.flash_resource[prop].Flash = !flash;
												this.flash_resource[prop].Counter = 30;
												this.flash_resource[prop].Iteration--;
											}
										}
									}
								}

								if ( flash )
									ctx.fillStyle = color;
								else
									ctx.fillStyle = "#FFFFFF";

								var rx = 25 + ( 115 * i ) + this.x + this.ox;
								var ry = 45 + this.y + this.oy;
								ctx.fillText(resources[i] + " " + context.Resources[resources[i]], rx, ry);
							}
						}
					}
				});

				var planet = new Drawable({
					image: 'planet.png',
					x: 400,
					y: 400,
					gravity_source: true,
					listeners: {
						onupdate: function() {
							this.rotation = ((this.rotation || 0) + 0.25) % 360;
						}
					}
				});

				var viking = new Drawable({
					image: 'bubbleviking.png',
					x: 350,
					y: 220,
					rotation: -20,
					scale: 0.45,
					listeners: { 
						onload: function() { 
							this.boom = false;
							this.rox = (this.image.width / 2) - 45;
							this.roy = (this.image.height / 2) - 45;
						},
						onupdate: function() {
							var delta = 0.1;
							if ( this.boom )
								this.rotation += delta;
							else
								this.rotation -= delta;

							if ( this.rotation > 20 || this.rotation < -20 )
								this.boom = !this.boom;

							if ( context.Upgrades.Weapons > 1 ) {
								this.image = Assets.Get("bubbleviking_upgrade.png");
							}
						}
					}
				});

				// Add the sound icon.
				this.addAsset(new Drawable({
					name: 'speaker',
					image: 'speaker.png',
					x: 20,
					y: 800 - 45,
					listeners: {
						onload: function() {
							this.playing = true;
						},
						ondraw: function() {
							if ( this.playing ) {
								this.image = Assets.Get('speaker.png');
							} else {
								this.image = Assets.Get('speaker_off.png');
							}
						},
						onmousedown: function(x,y) {
							if ( this.isCollided(x , y - (this.image.height)) ) {
								if ( this.playing ) {
									background_music.pause();
									this.playing = false;
								} else {
									background_music.volume = 0.25;
									background_music.loop = true;
									background_music.play();
									this.playing = true;
								}
							}
						}
					}
				}));

				this.addAsset(hud);
				this.addAsset(planet);
				this.addAsset(viking);

				this.addAsset(createAction(5, 800 - 69, 'action_fight.png', 'Launch a raid against the population.', function(){

					// Fire a missile,
					// then update the resources accordingly.
					// And probably display a status report from the field of battle.
					enter_scenic_mode();
					if ( context.Upgrades.Weapons > 1 ) {
						fireMissile.call(self, 450, 230, function() { 
						}, 4, true);
					}

					fireMissile.call(self, 350, 220, function() {
						mod_metal((10 * context.Upgrades.Crew ) + (5 * (context.Upgrades.Weapons-1)));
					});

				}, function() {
					return true;
				}));

				this.addAsset(createAction(74, 800 - 69, 'action_siege_disabled.png', 'Claim some land on this planet.', function() {

					// Claim some land.
					enter_scenic_mode();
					Assets.Play("generic.wav");
					powerUp.call( this, viking.x, viking.y, viking, function() {
						planetBeam.call(this, function() {
							mod_metal(-10 * (context.Upgrades.Level * 2));
							context.Resources.Land += (10 * context.Upgrades.Crew);
							flashResource("Land", "#00BA65");
							flashResource("Metal", "#FF0000");
						});
					}, '#C6008B');

				}, function() {
					return (context.Resources.Metal >= (10 * context.Upgrades.Level * 2));
				}));

				this.addAsset(createAction(74 + 64 + 5, 800 - 69, 'action_farm_disabled.png', 'Farm some of the land you\'ve acquired.', function() {
					enter_scenic_mode();
					Assets.Play('chickens.wav', 0.8);
					powerUp.call( this, viking.x, viking.y, viking, function() {
						mod_food(12 * context.Upgrades.Level);
						context.Resources.Land -= 10;
						exit_scenic_mode();
					}, '#FFFF00');
				}, function() {
					return context.Resources.Land >= 15 * context.Upgrades.Level;
				}));
				this.addAsset(createAction(74 + 64 + 5  + 5 + 64, 800 - 69, 'action_fix_disabled.png', 'Repair your ship through the vegence of Thor!', function() {
					enter_scenic_mode();
					Assets.Play('heal.wav', 1.0);
					powerUp.call( this, viking.x, viking.y, viking, function() {
						mod_metal(-10 * context.Upgrades.Level);
						context.HP += 1 + context.Upgrades.Crew;
						context.HP = Math.min( context.HP, context.MAX_HEALTH );
						exit_scenic_mode();
						end_turn();
					});
				}, function() {
					return (context.HP < (context.MAX_HEALTH - 1)) && context.Resources.Metal >= (15 * context.Upgrades.Level);
				}));

				this.addAsset(createAction(74 + 64 + 5  + 5 + 64 + 64 + 5, 800 - 69, 'action_upgrade_disabled.png', 'Upgrade your space-boat.',
				function() {
					enter_scenic_mode();
					showUpgradeWindow.call(this);
				}, function() {
					return context.Resources.Metal >= 30;
				}));
			},
			onupdate: function() {

				if ( this.move_hud || this.move_hud_back ) { 
					var target_down = ['action'];
					var target_up = ['hud'];
					var reset = false;

					this.velocity += 0.01;
					this.velocity *= 1.15;

					if ( Math.abs( this.velocity ) > 10 )
						this.velocity = (this.velocity > 0) ? 10 : -10;

					if ( this.move_hud_back )
						this.velocity = Math.abs(this.velocity) * -1;

					for ( var i = 0; i < this.assets.length; i++ ) { 
						for ( var r = 0; r < target_down.length; r++ ) {
							if ( this.assets[i].name === target_down[r] ) {
								if ( (this.move_hud_back && this.assets[i].oy > 0) || (this.move_hud && this.assets[i].oy < 100) )
									this.assets[i].oy += this.velocity;
								else {
									if ( this.move_hud_back )
										reset = true;

									this.move_hud = false;
									this.move_hud_back = false;
								}
							}
						}

						for ( var r = 0; r < target_up.length; r++ ) { 
							if ( this.assets[i].name === target_up[r] ) {
								if ( this.move_hud_back || (this.move_hud && this.assets[i].oy > - 100))
									this.assets[i].oy -= this.velocity;
							}
						}
					}

					// If we have to reset, find everything and set the ox/oy to zero.
					if ( reset ) {
						for ( var i = 0; i < this.assets.length; i++ ) {
							this.assets[i].ox = 0;
							this.assets[i].oy = 0;
						}
					}
				} else {
					this.velocity = 0;
				}

			}
		}
	});
};