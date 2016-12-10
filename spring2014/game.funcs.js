// game.funcs.js
// The game function definitions.
// Created by SharpCoder
// 2014-04-26
var activeMsg = 0;
function doMsgAnimation( controlID, count ) {
	if ( count > 40 ) { 
		$("#" + controlID).remove();
		activeMsg--;
		return;
	}
	var old = parseFloat( $("#" + controlID).css("top") );
	if ( isNaN(old) ) old = 0;	
	$("#" + controlID).css({
		"top": (old + 2).toString() + "px"
	});
	setTimeout( function() {
		doMsgAnimation( controlID, count + 1 );
	}, 30 );
}

function animateMessage( msg, color, fontsize ) {
	setTimeout( function() {
		color = color || 'white';
		fontsize = fontsize || '12px';
		var x = 25 + ( 10 * Math.random() );
		var y = 10;
		var uid = Engine.generateUID();
		var html = "<div style='color: " + color + "; font-size: " + fontsize + "; position: absolute;  top: " + x + "px; right: " + y + "px;' id='msg-" + uid +"'>";
		html += msg;
		html += "</div>";
		
		$("#container").append( html );
		doMsgAnimation( "msg-" + uid, 0 );
	}, 200 * activeMsg);
	activeMsg++;
}

function generateGreekName() {
	
	var name = '';
	var gods = ['Chaos','Cronus','Zeus','Nyx','Rhea','Hera','Erebus','Coeus','Demeter','Aether','Phoebe','Athena','Hemera','Oceanus','Artemis','Tartarus','Tethys','Apollo','Eros','Iapetus','Ares','Pontus','Hyperion','Hephaestus','Gaia','Mnemosyne','Hermes ','Uranus ','Theia','Aphrodite','Crius','Hestia','Themis','Hades','Poseidon','Aeolus','Achlys','Achos','Alala','Alastor','Amphitrite','Ania','Ariadne','Asclepius','Asteria','Astraeus ','Atlas','Bia','Charon','Cratus','Deimos','Eileithyia','Elpis','Enyo','Eos','Epimetheus','Eris','Eros','Eurus','Eutychia','Geras','Harmonia','Hebe','Hecate','Helios','Heracles','Homados','Hypnos','Iris ','Khione','Kydoimos','Leto','Lethe','Lupe','Melinoe','Momus','Moros','Morpheus','Nemesis','Nike','Notus','Oizys','Paean','Palaemon','Pallas','Palioxis ','Pan','Persephone','Perses','Phobos','Phrike','Polemos','Proioxis','Prometheus','Psyche','Selene','Soter','Soteria','Thanatos','Triton','Tyche','Zelus','Zephyrus'];
	var vowls = ['a','e','i','o','u'];
	
	// Randomly generate a name.
	var n1 = Math.round( Math.random() * (gods.length - 1) );
	var n2 = Math.round( Math.random() * (gods.length - 1) );
	
	try {
		// Find the two gods.
		var g1 = gods[n1];
		var g2 = gods[n2];
		
		// Split.
		for ( var i = g1.length / 2; i < g1.length; i++ ) {
			for ( var r = 0; r < vowls.length; r++ ) {
				if ( g1[i] == vowls[r] ) {
					name = g1.substr(0, i);
					break;
				}
			}
			if ( $.trim(name).length > 0 ) break;
		}
		
		var br = false;
		for ( var i = 0; i < g2.length; i++ ) {
			for ( var r = 0; r < vowls.length; r++ ) {
				if ( g2[i] == vowls[r] ) {
					name += g2.substr(i);
					br = true;
					break;
				}
			}
			if ( br ) break;
		}
		
		if ( $.trim(name).length < 3 ) {
			name = g1;
		}
		
		return (name.substr(0,1).toString().toUpperCase()) + name.substr(1).toString().toLowerCase();
	} catch ( ex ) { }
	return "Nyx"; // Return something good if there is some kind of error...
}

function lcm( n1, n2 ) {
	n1 = Math.abs( n1 );
	n2 = Math.abs( n2 );
	
	var min = ( n1 < n2 ) ? n1 : n2;
	var max = ( n1 > n2 ) ? n1 : n2;
	
	for( var i = min; i > 2; i-- ) {
		if ( min % i == 0 && max % i == 0 )
			return i;
	}
	
	return min;
}

function createExplosion( x, y, scene, onEnd ) { 

	// Play the sound effect
	var sfx = "explosion" + (Math.round( Math.random() * 2 ) + 1) + ".wav";
	SoundManager.play( sfx, .3 );

	var explosion = new Asset({
		src: 'explosion_1.png',
		x: x,
		y: y,
		vx: 0,
		vy: 0,
		gravity: false,
		listeners: {
			onUpdate: function() {
				if ( this.animation_ended ) {
					this.visible = false;
					scene.removeAsset( this );
					if ( onEnd !== undefined )
						onEnd();
				}
			}
		}
	});
	
	explosion.addAnimation( 'explosion_1.png' );
	explosion.addAnimation( 'explosion_2.png' );
	explosion.addAnimation( 'explosion_3.png' );
	explosion.addAnimation( 'explosion_4.png' );
	explosion.addAnimation( 'explosion_5.png' );
	
	scene.addAsset( explosion );
}

function createAsteroid( x, y, scene ) {
	
	var asteroid = new Asset({
		src: 'asteroid.png',
		x: x,
		y: y,
		vx: 4.5,
		vy: 0,
		angle: Math.random() * 180,
		speed: 1,
		mass: 20,
		gravity: true,
		listeners: {
			onUpdate: function() {
				this.angle = ( this.angle + 0.05 ) % 360;
			}
		}
	});
	
	scene.addAsset( asteroid );
	return asteroid;
}

var activeDialog = null;

function createDialog( planet, dialog, onFinish ) {

	// Abusing globals, I know, sorry...
	activeDialog = dialog;
	$("#dialog-title").text( planet + " - " + dialog.title );
	$("#dialog-message").text( dialog.description );
	$("#dialog").css("display", "block");
	$("#dialog-buttons").html("");
	
	// Create the buttons.
	for ( var i = 0; i < dialog.options.length; i++ ) {
		
		var btn = "<div class='dialog-button' data-index='" + i + "' id='dialog-option-" + i + "'>";
		btn += dialog.options[i].text;
		btn += "</div>";
		$("#dialog-buttons").append( btn );
		$("#dialog-option-" + i).on('click', function() {
			
			var option = activeDialog.options[ $(this).attr("data-index") ];
			if ( option.award !== undefined )
				Engine.addPoints( option.award );
				
			if ( option.cost !== undefined )
				Engine.addPoints( -option.cost );
			
			$("#dialog-message").text( option.response );
			$("#dialog-buttons").html("<div class='dialog-button' id='dialog-option-okay'>Okay</div>");
			$("#dialog-option-okay").on('click', function() {
				$("#dialog").css("display", "none");
				if ( onFinish !== undefined )
					onFinish();
			});
			
		});
		
	}
	
}

function createPlanet( x, y ) {
	var asset = "planet" + Math.round( (Math.random() * 3) + 1 ) + ".png";
	var rand = Math.random() * 10000;
	
	var planet = new Asset({
		x: x,
		y: y,
		width: 300,
		height: 300,
		mass: 1000000 + rand,
		attributes: {
			core_image: 'core.png',
			core_image_disabled:  'core_disabled.png',
			planet_image: asset,
			harvestable: false,
			x: x,
			y: y,
			damageCount: 0,
			// This god aweful thing is the definition of a tesselated hexagonal grid in the shape of a circle.
			circle: [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,5,5,5,5,5,5,5,5,5,0,0,0,0],
						[0,0,0,0,5,5,5,5,5,5,5,5,5,5,0,0,0,0],
						[0,0,0,5,5,5,4,4,4,4,4,4,4,4,4,4,0,0],
						[0,0,5,5,5,4,4,4,4,4,4,4,4,4,4,4,0,0],
						[0,0,5,5,4,4,4,4,4,4,4,4,4,4,4,4,2,0],
						[0,5,5,4,4,4,4,4,4,4,4,4,4,4,4,3,2,0],
						[0,5,4,4,4,4,3,3,3,3,3,3,3,3,3,3,2,0],
						[0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,0],
						[0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,0],
						[0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,0],
						[0,0,2,2,3,3,3,3,3,3,3,3,3,2,2,2,0,0],
						[0,0,0,2,2,2,2,3,3,3,3,3,2,2,2,0,0,0],
						[0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
						[0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
			damage: function (x, y, mag, planet) {
			
				var height = this.circle.length - 1;
				var width = this.circle[0].length - 1;
				var midX = Math.round(width / 2);
				var midY = Math.round(height / 2);
				
				// Calculate the unit vector.
				var ux = Math.abs(this.x - 75 - x) / width;
				var uy = Math.abs(this.y - 75 - y) / height;
								
				// Do the damage.				
				var right = ux < midX, down = uy < midY, done = false;
				
				for ( var y1 = uy; (y1 < height - 1) && y1 < uy + mag && y1 >= 0 && !done; ) {
					for ( var x1 = ux; (x1 < width - 1) && ux < ux + mag && x1 >= 0 && !done; ) {
						
						try {
							if ( this.circle[Math.floor(y1)][Math.floor(x1)] == 0 ) {
								if ( right ) x1++; 
								else x1--;
								if ( down ) y1++;
								else y1--;
							} else {
								// Mine around it.
								for ( var z = 0; z < mag; z++ ) {
									for ( var z1 = 0; z1 < mag; z1++ ) {
										if ( Math.floor( y1 + z ) < height - 1 && Math.floor( x1 + z1 ) < width - 1 ) {
											this.damageCount++;
											this.circle[Math.floor(y1 + z)][Math.floor(x1 + z1)] = 0;
										}
									}
								}
								done = true;	
								break;							
							}
						} catch ( ex ) { done = true; }
					}
				}
				
				// Check for the condition.
				if ( this.damageCount > 130 && planet !== undefined ) {
					planet.detectCollision = true;
				}
				
			}
		},
		listeners: {
			onClick: function( ) { 
				Engine.getActiveScene().triggerComplete();
			},
			onBeforeDraw: function( ctx ) {
			
				// Draw the planet core.
				var coreImg = this.attributes.core_image_disabled;
				if ( this.attributes.damageCount > 130 )
					coreImg = this.attributes.core_image;
					
				var img = AssetManager.getImage(coreImg);
				ctx.drawImage( img, this.x - ( img.width / 2), this.y - (img.height / 2));
				
			
				var radius = 10;
				var h = Math.sin( 30 * (Math.PI / 180) ) * radius;
				var r = Math.cos( 30 * (Math.PI / 180) ) * radius;
				
				// Calculate the circle points.
				var max_width = 4;
				var prevx = 0;

				ctx.save();
				ctx.beginPath();
				var circle = this.attributes.circle;
				for( var y = 0; y < circle.length; y++ ){
					for ( var x = 0; x < circle[y].length; x++ ) {
						var fill = "#2571DB";
						if ( circle[y][x] == 0 ) continue;
						else if ( circle[y][x] == 2 ) fill = "#0E2D56";
						else if ( circle[y][x] == 3 ) fill = "#1E5FB5";
						else if ( circle[y][x] == 4 ) fill = "#277CEA";
						else if ( circle[y][x] == 5 ) fill = "#93C4FF";
						
						var ox = x * (( 3 * radius) / 2) - (this.width / 2) + 15;
						var oy = (( x % 2) * r) + (2 * y * r) - (this.height / 2) +10;
						drawTriangle( ctx, this.x + ox, this.y + oy , radius, fill);
					}
				}
				ctx.fillStyle = "#000000";
				ctx.strokeStyle = "#000000";
				ctx.clip();
				
				var pImage = AssetManager.getImage( this.attributes.planet_image );
				ctx.drawImage( pImage, this.x - ( pImage.width / 2), this.y - ( pImage.height / 2 ));
				ctx.closePath();
				ctx.restore();
				
				return false;
			}
		}
	});
	
	return planet;
	
}

function drawTriangle( ctx, x, y, radius, fill ) {

	//ctx.beginPath();
	ctx.moveTo( x, y );
	var h = Math.sin( 30 * (Math.PI / 180) ) * radius;
	var r = Math.cos( 30 * (Math.PI / 180) ) * radius;
	
	ctx.lineTo( x + radius, y + 0 );
	ctx.lineTo( x + radius + h, y + r );
	ctx.lineTo( x + radius, y + r * 2 );
	ctx.lineTo( x, y + r * 2 );
	ctx.lineTo( x - h, y + r );
	
}

function createPlayer( x, y ) {
	var player = new Asset({
		src: 'ship.png',
		gravity: true,
		detectCollision: true,
		mass: 30,
		x: x, 
		y: y,
		vy: 0,
		vx: 2 + Math.round( Math.random() * 2 ),
		speed: 1,
		angle: 90,
		detectKeys: true,
		listeners: {
			onKeyDown: function( which ) {
				if ( which == 32 ) {
					if ( this.src !== "ship_move.png" )
						this.setImage( "ship_move.png" );
						
					// Add to the vectors!
					var mouse = Engine.getMousePos();
					
					var vx = ( mouse[0] - this.x );
					var vy = ( mouse[1] - this.y );
					var rad = Math.atan2( vx, vy );
					
					this.vx += Math.sin( rad ) * 0.5;
					this.vy += Math.cos( rad ) * 0.5;
				}
				
			},
			onKeyUp: function( which ) {
				if ( this.src !== "ship.png" ) {
					this.setImage( "ship.png" );
				}
			},
			onMouseMove: function( x, y ) {
				this.targetX = x;
				this.targetY = y;
			},
			onMouseDown: function() {
				// Only fire if we can.
				var energyCost = 30;
				var player = Engine.getPlayer();
				if ( player.charge >= energyCost ) {
					createBullet( this.x - 10, this.y + 10, this.gTarget, Engine.getActiveScene() );
					player.charge -= energyCost;
					Engine.addPoints( -5 );
				}
				
			},
			onUpdate: function() {
				if ( Engine.getSceneUptime() < 100 ) return;
				
				var player = Engine.getPlayer();
				var planet = Engine.getActiveScene().getPlanet();
				if ( planet == undefined || planet == null ) return;
				
				var dist = Math.sqrt( Math.pow( planet.x - this.x, 2 ) + Math.pow( planet.y - this.y, 2 ) );
				
				if ( dist < 100 ) {
					player.health=0;
				}
				
				if ( this.targetX !== undefined ) {
					var opposite = this.targetY - this.y;
					var adjacent = this.targetX - this.x;
					var angle = Math.atan2( opposite, adjacent );
					this.angle = ( ( angle * Math.PI )/ 4 );
				}
				
				// If our health is equal to or below zero, kill ourselves.
				if ( player.health <= 0 ) {
					Engine.addPoints( -50 );
					this.vx = 0;
					this.vy = 0;
					this.gravity = false;
					this.visible = false;
					this.update = false;
					player.health = 100;
					
					var planet = Engine.getActiveScene().getPlanet();
					if ( planet !== undefined ) {
						planet.attributes.damage( this.x, this.y, 3 );
					}
					
					Engine.deductLife();
					createExplosion( this.x, this.y, Engine.getActiveScene(), function() {
						Engine.getActiveScene().restore();
					});
				}
				
				
				// Cap the velocity.
				this.vx = Math.min( this.vx, 7 );
				this.vy = Math.min( this.vy, 7 );
			}
		}
	});
	
	return player;
}

function createBullet( x, y, target, scene ) {
	
	if ( target === undefined ) return;
	
	var pos = Engine.getMousePos();
	var vx = pos[0] - x;
	var vy = pos[1] - y;
	var l = lcm( vx, vy );
	vx = vx / l;
	vy = vy / l;
	if ( vx > 3 ) vx = 3;
	else if ( vx < -3 ) vx = -3;
	if ( vy > 3 ) vy = 3;
	else if ( vy < -3 ) vy = -3;
	
	// Play a sound effect.
	var sfx = "shoot" + (Math.round( Math.random() * 1 ) + 1) + ".wav";
	SoundManager.play( sfx, .3 );
	
	var bullet = new Asset({
		src: 'bullet.png',
		x: x,
		y: y,
		vx: vx * 2,
		vy: vy * 2,
		gravity: true,
		mass: 20,
		speed: 1,
		listeners: {
			onUpdate: function() {
				if ( this.visible == true && this.gTargetDistance !== undefined && this.gTargetDistance < 100 && this.gTarget.mass > 500 ) {
					
					var planet = scene.getPlanet();
					if ( planet !== null && planet.attributes.damage !== undefined ) {
						planet.attributes.damage( this.x, this.y, 3, planet );
					}
					
					createExplosion( this.x, this.y, scene );
					scene.removeAsset( this );
				}
			}
		}
	});
	
	scene.addAsset( bullet );
}