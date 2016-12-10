// game.assets.js
// The game asset definition file.
// Created by SharpCoder
// 2014-04-25
var GameLogic = (function() {
	return {
		init: function() {
			
			var cMainMenuScene = "main_menu";
			var cMapScene = "map";
			var cStoryScene = "story";
			var cBattleScene = "battle";
			var cGameOverScene = "game_over";
			var cInstructionScene = "instruction_menu";
			
			var scene_menu = new Scene({ name: cMainMenuScene });
			var scene_map = new Scene({ name: cMapScene });
			var scene_story = new Scene({ name: cStoryScene });
			var instruction_scene = new Scene({ name: cInstructionScene });
			
			// Create the instruction scene.
			instruction_scene.addAsset(new Asset({
				src: 'instructions_hud.png',
				x: ( Engine.nWidth / 2),
				y: ( Engine.nHeight / 2) - 50,
				detectCollision: true,
				listeners: {
					onClick: function() {
						Engine.loadScene( cMapScene );
					}
				}
			}));
			
			function createBattleScene() {
				
				var scene = new Scene({ name: cBattleScene });
				
				// Set the onComplete state.
				scene.setOnComplete(function() {
					// Check for winning condition.
					var player = Engine.getPlayer();
					if ( player.mapY == PlanetMap.topology.length - 1 ) {
						// Win Screen
						Engine.addPoints( 100 );
						Engine.doGameOver();
						Engine.removeScene( cBattleScene );
					} else {
						// Otherwise, load the map screen.
						Engine.addPoints( player.activePlanet.worth );
						Engine.loadScene( cMapScene );
						Engine.removeScene( cBattleScene );
					}
				});
				
				// BATTLE SCENE
				// ************************
				// Build the triangle planet and get ready to destroy it!
				scene.addAsset( createPlayer( Engine.nWidth / 2, 50 ) );
				scene.addAsset( createPlanet( 500, 350 ) );
				
				// Setup the HUD for the battle bridge.
				scene.setDrawHud(function( ctx ) {
				
					ctx.save();
					var player = Engine.getPlayer();
					
					// Health Bar.
					ctx.fillStyle = "#DB000A";
					ctx.beginPath();
					ctx.moveTo( 45, 5 );
					ctx.lineTo( 45 + (Math.max( player.health, 5 ) * 2), 5 );
					ctx.lineTo( 45 + Math.max(Math.max( player.health, 0 ) * 2 - 25, 5), 25 );
					ctx.lineTo( 45, 25 );
					ctx.fill();
					ctx.closePath();
					
					// Set the fill color.
					ctx.beginPath();
					ctx.fillStyle = "#314C13";
					ctx.fillRect( 45, 35, 200, 5 );
					ctx.closePath();
					
					ctx.beginPath();
					ctx.fillStyle = "#82CF34";
					ctx.fillRect( 45, 30, player.charge * 2, 10 );
					ctx.closePath();
					
					// Draw the score.
					ctx.font = "20pt Electrolize";
					ctx.fillStyle = "#82CF34";
					ctx.fillText( player.score, Engine.nWidth - 150, 20 );
					
					// Draw the lives.
					ctx.font = "24pt Electrolize";
					ctx.fillStyle = "#82CF34";
					ctx.fillText( player.lives, 10, 35 );
					
					var instructions = ['[Click]  to shoot', '[Space]  to move'];
					ctx.font = "12pt Electrolize";
					ctx.fillStyle = "rgba( 255, 255, 255, 0.5 )";
					for ( var i = 0; i < instructions.length; i++ )
						ctx.fillText( instructions[i], Engine.nWidth - 150, 70 + ( 20 * i ));
					
					ctx.restore();
				});
				
				scene.save();
				return scene;
			}
			
			// Initialize the main menu.
			var core_image = new Asset({ 
				src: 'planet_core.png',
				mass: 1000000,
				x: 500,
				y: 280
			});

			var title_text = new Asset({
				text: 'Moon Harvest',
				textColor: "#FF5000",
				font: '42pt Electrolize',
				x: 330,
				y: 125
			});
			
			var btn_begin = new Asset({
				text: 'Begin',
				font: '34pt Electrolize',
				x: 450,
				y: 580,
				width: 130,
				height: 40,
				detectCollision: true,
				listeners: {
					onClick: function() {
						Engine.loadScene( cInstructionScene );
						$("*").css("cursor", "default");
					},
					onUpdate: function() {
						if ( this.isHovered ) { 
							this.textColor = "#FF0000";
						} else {
							this.textColor = "#FFFFFF";
						}
					}
				}
			});
			
			// Add the sprites.
			scene_menu.addAsset( core_image );	
			scene_menu.addAsset( title_text );
			scene_menu.addAsset( btn_begin );
			
			createAsteroid( 500, 100, scene_menu );
			
			// MAP SCENE
			// ************************
			// Traverse the planet graph and create an asset for each of the nodes.
			// Add the map background.
			scene_map.addAsset(new Asset({
				src: 'map_hud.png',
				x: (Engine.nWidth / 2),
				y: (Engine.nHeight / 2) - 50
			}));
			
			function traverse( layer, depth ) {
				if ( layer === undefined ) return;
				// Look at the topology from here.
				var y = (PlanetMap.maxBreadth - PlanetMap.topology[depth] ) * 40;
				var baseX = ( Engine.nWidth / 2 ) - 360;
				var baseY = ( Engine.nHeight / 2 ) - 240;
				
				for ( var i = 0; i < layer.length; i++ ) {			
					
					var planet = layer[i];
					var planetName = layer[i].name;
					var mapX = i;
					var mapY = depth;
					var nextLayer = [];
					
					if ( layer[i].children !== undefined ) 
						nextLayer = layer[i].children;
					
					var node = new Asset({
						src: 'planet_node.png',
						attributes: {
							planet: planet,
							name: planetName,
							mapX: mapX,
							mapY: mapY
						},
						x: baseX + 50 + (depth * 100),
						y: baseY + 50 + (i * 80) + y,
						detectCollision: true,
						listeners: {
							onClick: function() {						
								var player = Engine.getPlayer();
								if ( player.mapY + 1 == mapY ) {
									// Update our position on the graph.
									player.mapX = this.attributes.mapX;
									player.mapY = this.attributes.mapY;
									player.activePlanet = this.attributes.planet;
									
									// Load the scene.
									Engine.loadScene( cStoryScene );
									var dialog = DialogEngine.getRandomDialog();
									createDialog( this.attributes.name, dialog, function () {
										Engine.removeScene( cBattleScene );
										Engine.addScene(  createBattleScene() );
										Engine.loadScene( cBattleScene );
									});
								}
							},
							onUpdate: function() {
								var player = Engine.getPlayer();
								if ( mapY == player.mapY + 1 ) { 
									if ( this.src !== 'planet_node_target.png' ) {
										this.setImage( 'planet_node_target.png' );
									}
								} else {
									if ( this.src !== "planet_node.png" ) 
										this.setImage( "planet_node.png" );
								}
							},
							onBeforeDraw: function( ctx ) {
								var player = Engine.getPlayer();
								
								if ( nextLayer !== undefined && this.attributes.mapY == player.mapY && this.attributes.mapX == player.mapX ) {
									for ( var r = 0; r < nextLayer.length; r++ ) {
										var nx = 50 + ( depth + 1 ) * 100;
										var ny = 50 + ( r * 80 ) + ( PlanetMap.maxBreadth - PlanetMap.topology[depth+1] ) * 40;
										
										ctx.beginPath();
										ctx.strokeStyle = "#BEE07B";
										ctx.moveTo( this.x, this.y );
										ctx.lineTo( baseX + nx, baseY + ny );
										ctx.closePath();
										ctx.setLineDash([8]);
										ctx.stroke();
									}
								}
								
								return true;
								
							},
							onDraw: function( ctx ) { 		
								if ( this.isHovered ) {
								
									var player = Engine.getPlayer();
									var text = "";
									
									if ( this.attributes.mapY == player.mapY && this.attributes.mapX == player.mapX ) {
										text = "Your current location.";
									} else if ( this.attributes.mapY > player.mapY ) {
										text = "An unvisited location.";
									} else {
										text = "An unreachable location.";
									}
									
									var mouse = Engine.getMousePos();
									
									ctx.beginPath();
									ctx.fillStyle = "#000000";
									ctx.setLineDash([0]);
									ctx.fillRect( mouse[0], mouse[1], 200, 65);							
									ctx.strokeStyle = "#FFFFFF";
									ctx.strokeRect( mouse[0], mouse[1], 200, 65);
									ctx.stroke();
									
									ctx.font = "12pt Electrolize";
									ctx.fillStyle = "#FFFFFF";
									ctx.fillText( this.attributes.name, mouse[0] + 15, mouse[1] + 25 );
									
									ctx.font = "10pt Electrolize";
									ctx.fillText( text, mouse[0] + 15, mouse[1] + 45 );
									ctx.fill();
									ctx.closePath();
								}
							}
						}
					});
					
					scene_map.addAsset( node );
				}
				
				if ( layer !== undefined && layer.length > 0 && layer[0].children !== undefined )
					traverse( layer[0].children, depth + 1 );
			}
			
			traverse( PlanetMap.root, 0 );
			
			// Setup the story scene.
			scene_story.addAsset( new Asset({
				src: 'dialog_hud.png',
				x: ( Engine.nWidth / 2 ),
				y: ( Engine.nHeight / 2) - 50
			}));
			
			// Set the scenes.
			Engine.addScene( scene_menu );
			Engine.addScene( instruction_scene );
			Engine.addScene( scene_map );
			Engine.addScene( scene_story );
			
			// Wire up game over.
			Engine.setOnGameOver(function() {
				// Setup the game over scene.
				// **************************************
				var scene_game_over = new Scene({ name: cGameOverScene });
				scene_game_over.addAsset(new Asset({
					src: 'score_hud.png',
					x: Engine.nWidth / 2,
					y: Engine.nHeight / 2,
					listeners: {
						onLoad: function () {
							var msg = new Array();
							
							if ( Engine.getPlayer().lives <= 0 ) {
								msg.push("You have failed me for the last time...");
								msg.push("Good job dying!");
								msg.push("Better luck next time...");
								msg.push("Hopefully you've learned something...");
								msg.push("Generally speaking, crashing is bad.");
							} else {
								msg.push("Congratulations!");
								msg.push("That's one way to do it...");
								msg.push("I bet you can't unlock the secret level!");
							}
							
							var index = Math.round( Math.random() * ( msg.length - 1) );
							this.attributes.message = msg[index];
						},
						onDraw: function( ctx ) {
							ctx.beginPath();
							ctx.fillStyle = "#FFFFFF";
							ctx.font = "22pt Electrolize";
							ctx.fillText( this.attributes.message || '', (Engine.nWidth / 2) - 360, ( Engine.nHeight / 2 ) - 80 );
							
							ctx.font = "60pt Electrolize";
							ctx.fillStyle = "#82CF34";
							ctx.fillText( Engine.getPlayer().score.toString(), (Engine.nWidth / 2) - 360, ( Engine.nHeight / 2 ) + 25 );
							ctx.fill();
							ctx.closePath();
							
						}
					}
				}));
				
				scene_game_over.addAsset( new Asset({
					src: 'btn_retry.png',
					x: (Engine.nWidth / 2) - 290,
					y: (Engine.nHeight / 2) + 105,
					detectCollision: true,
					listeners: {
						onClick: function() {
							window.location.reload();
						},
						onUpdate: function() {
							if ( this.isHovered ) {
								if ( this.src !== "btn_retry_inverse.png" ) {
									this.setImage( "btn_retry_inverse.png" );
								}
							} else {
								if ( this.src !== "btn_retry.png" ) {
									this.setImage( "btn_retry.png" );
								}
							}
						}
					}
				}));
			
				Engine.addScene( scene_game_over );
				Engine.removeScene( cBattleScene );
				Engine.loadScene( cGameOverScene );
			});
			
		}
	};
})();