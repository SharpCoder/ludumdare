// engine.js
// The framework for my LD48 entry.
// Created by SharpCoder
// 2014-04-25

Object.prototype.clone = function() {
  if(this.cloneNode) return this.cloneNode(true);
  var copy = this instanceof Array ? [] : {};
  for(var attr in this) {
    if(typeof this[attr] == "function" || this[attr]==null || !this[attr].clone)
      copy[attr] = this[attr];
    else if(this[attr]==this) copy[attr] = copy;
    else copy[attr] = this[attr].clone();
  }
  return copy;
}

function isTypeOf( root, target ) {
	for( var prop in target )
		if ( target.hasOwnProperty( prop ) )
			if ( !root.hasOwnProperty( prop ))
				return false;
	return true;
}

Engine = (function() {

	var player = {
		score: 500,
		health: 100,
		charge: 100,
		lives: 3,
		mapX: 0,
		mapY: 0,
		activePlanet: null
	};
	
	var canvas_width = 1000;
	var canvas_height = 800;
	var scenes = new Array();
	var activeScene = null;
	var mouseX = 0, mouseY = 0;
	var uid = 0;
	
	return {
		onGameOver: function() { },
		nWidth: canvas_width,
		nHeight: canvas_height,
		init: function ( canvas ) {
			$("#" + canvas.id).width( this.nWidth );
			$("#" + canvas.id).height( this.nHeight );
		},
		triggerKeyDown: function( key ) {
			if ( activeScene == null ) return;
			var assets = activeScene.getAssets();
			for ( var i = 0; i < assets.length; i++ ) {
				if ( assets[i].detectKeys === true && assets[i].update ) {
					assets[i].onKeyDown( key );
				}
			}
		},
		triggerKeyUp: function ( key ) {
			if ( activeScene == null ) return;
			var assets = activeScene.getAssets();
			for ( var i = 0; i < assets.length; i++ ) {
				if ( assets[i].detectKeys === true && assets[i].update ) {
					assets[i].onKeyUp( key );
				}
			}
		},
		triggerMouseMove: function( x, y ) {
			if ( activeScene == null ) return;			
			mouseX = x;
			mouseY = y;
			var assets = activeScene.getAssets();
			var hovered = false;
			
			for ( var i = 0; i < assets.length; i++ ) {
				if ( assets[i].detectCollision && assets[i].update ) {
					if ( assets[i].onMouseMove !== null )
						assets[i].onMouseMove( x, y );
					if ( mouseX > (assets[i].x - (assets[i].width / 2))&& (mouseX < assets[i].x + assets[i].width)
						&& mouseY > (assets[i].y - ( assets[i].height / 2)) && (mouseY < assets[i].y + assets[i].height) ) {
						assets[i].isHovered = true;
						hovered = true;
					} else {
						assets[i].isHovered = false;
					}
				}
			}
			
			if ( hovered ) {
				$("*").css("cursor", "pointer");
			} else {
				$("*").css("cursor", "default");
			}
		},
		triggerMouseDown: function() {
			if ( activeScene == null ) return;
			// Check for the grave period.
			if ( (new Date()).getTime() - activeScene.loaded < 100 )
				return;
			var assets = activeScene.getAssets();
			var clickTarget = new Array();
			var mouseDownTarget = new Array();
			
			for ( var i = 0; i < assets.length; i++ ) {
				if ( assets[i].detectCollision && assets[i].update ) {
					if ( assets[i].onMouseDown !== null ) {
						mouseDownTarget.push( assets[i] );
					}
					
					// Check for click.
					if ( mouseX > (assets[i].x - (assets[i].width / 2))&& (mouseX < assets[i].x + assets[i].width)
					&& mouseY > (assets[i].y - ( assets[i].height / 2)) && (mouseY < assets[i].y + assets[i].height) ) {
						clickTarget.push( assets[i] );
					}
				}
			}
			
			for ( var i = 0; i < mouseDownTarget.length; i++ ) {
				mouseDownTarget[i].onMouseDown();
			}
			
			for ( var i = 0; i < clickTarget.length; i++ ) {
				clickTarget[i].onClick();
			}
		},
		addScene: function(scene) {
			if ( isTypeOf( scene, new Scene() ) ) {
				scenes.push( scene );
				if ( activeScene == null ) activeScene = scene;
			}
		},
		loadScene: function( name ) {
			if ( name === undefined || name === null ) return;
			for ( var i = 0; i < scenes.length; i++ ) {
				if ( scenes[i].name.toString().toLowerCase() == name.toString().toLowerCase() ) {
					scenes[i].loaded = (new Date()).getTime();
					activeScene = scenes[i];
				}
			}
		},
		removeScene: function ( name ) {
			var swap = false;
			for ( var i = 0; i < scenes.length; i++ ) {
				
				if ( swap ) {
					scenes[i - 1] = scenes[i];
				}
				
				if ( scenes[i].name.toString().toLowerCase() == name.toString().toLowerCase() ) {
					swap = true;
				}
				
			}
			if ( swap )
				scenes.length--;
		},
		doUpdate: function() {
			if ( activeScene == null ) return;
			if ( activeScene.callback !== undefined )
				activeScene.callback();
				
			var assets = activeScene.getAssets();
			var gConst = 0.0001;
			
			if ( player.charge < 0 )
				player.charge = 0;
			else if ( player.charge < 100 )
				player.charge+=0.5;
			else if ( player.charge > 100 )
				player.charge = 100;
			
			if ( player.health < 0 )
				player.health = 0;
			else if ( player.health > 100 )
				player.health = 100;
			
			// Since this is a gravity game, do the gravity logic stuff
			// like calculating the gForce variable for all the things relative to each other.
			for ( var i = 0; i < assets.length; i++ ) {
				if ( assets[i].gravity ) {
					assets[i].gForce = 0;
					for ( var r = 0; r < assets.length; r++ ) {
						if ( r == i ) continue;
						
						// First, calculate the distance.
						var dist = Math.sqrt( Math.pow( assets[r].x - assets[i].x, 2 ) + 
											  Math.pow( assets[r].y - assets[i].y, 2 ) );
											  
						// Next, do all the other calculations.
						var force = ( gConst * assets[r].mass * assets[i].mass ) / Math.pow( dist, 2 );			
						if ( assets[i].gTargetMass <= assets[r].mass ) {
							assets[i].gForce = force;
							assets[i].gTarget = assets[r];
							assets[i].gTargetDistance = dist;
							assets[i].gTargetMass = assets[r].mass;
						}
					}
				}
			}
			
			for ( var i =0; i < assets.length; i++ ){
				assets[i].doUpdate();
			}
		},
		doDraw: function( ctx ) {
			if ( activeScene == null ) return;
			ctx.clearRect( 0, 0, canvas_width, canvas_height );
			var assets = activeScene.getAssets();
			
			for ( var i = 0; i < assets.length; i++ ) {
				assets[i].onBeforeDraw( ctx );
			}
			
			for ( var i = 0; i < assets.length; i++ ) {
				assets[i].doDraw( ctx );
			}
			
			for ( var i = 0; i < assets.length; i++ ) {
				assets[i].onDraw( ctx );
			}
			
			// Draw the HUD.
			activeScene.drawHud( ctx );
		},
		setOnGameOver: function( callback ) {
			if ( callback !== undefined )
				Engine.onGameOver = callback;
		},
		generateUID: function() {
			return (uid++);
		},
		getPlayer: function() {
			return player;
		},
		getMousePos: function() {
			return [mouseX, mouseY];
		},
		addPoints: function ( delta ) {
			if ( delta !== 0 ) {
				var color = ( delta >= 0 ) ? "green" : "red";
				var msg = (delta >= 0 )? "+" : "";
				msg += delta + " credits";
				animateMessage(msg, color, '24px');
			}
			player.score += delta;
		},
		getSceneUptime: function() {
			if ( activeScene == null ) return 0;
			return ( ((new Date()).getTime() - activeScene.loaded) );
		},
		getActiveScene: function() {
			return activeScene;
		},
		deductLife: function() {
			player.lives--;
			if ( player.lives <= 0 ) {
				Engine.onGameOver();
			}
		},
		doGameOver: function() {
			if ( Engine.onGameOver !== undefined )
				Engine.onGameOver();
		}
	};
	
})();

Scene = function( config ) {
	config = config || {};
	this.assets = new Array();
	this.name = config.name || "";
	this.x = config.x || 0;
	this.y = config.y || 0;
	this.created = (new Date()).getTime();
	this.loaded = 0;
	this.onDrawHud = config.drawHud || function( ctx ) { };
	this.onComplete = config.onComplete || function( ) { };
	this.state_obj = null;
	this.state_attr = null;
};

Scene.prototype.triggerComplete = function() {
	if ( this.onComplete !== undefined ) {
		this.onComplete();
	}
}

Scene.prototype.setOnComplete = function( callback ) {
	if ( callback !== undefined ) {
		this.onComplete = callback;
	}
}

Scene.prototype.drawHud = function( ctx ) {
	if ( this.onDrawHud !== undefined )
		this.onDrawHud( ctx );
};

Scene.prototype.addAsset = function( asset ) {
	if ( isTypeOf( asset, new Asset() ) ) {
		this.assets.push( asset );
	}
}

Scene.prototype.getAssets = function() {
	return this.assets;
};

Scene.prototype.setUpdateFunction = function( callback ) {
	this.callback = callback;
}

Scene.prototype.save = function() {
	// Create a property-by-property copy of this object.
	this.state_obj = new Array();
	this.state_attr = new Array();
	
	for ( var i = 0; i < this.assets.length; i++ ) {
		this.state_obj.push( this.assets[i].config );
		//this.state_attr.push( JSON.stringify(this.assets[i].config.attributes || {}) );
	}
}

Scene.prototype.restore = function() {
	if ( this.state_obj == null ) return;
	this.loaded = (new Date()).getTime();
	
	for ( var i = 0; i < this.assets.length; i++ )
		this.assets.pop();
		
	this.assets.length = 0;
	for ( var i = 0; i < this.state_obj.length; i++ ) {
		var obj = this.state_obj[i];
		//obj.attributes = JSON.parse(this.state_attr[i] );
		this.assets.push(new Asset( obj ));
	}
	
}

Scene.prototype.removeAsset = function( asset ) {
	if ( isTypeOf( asset, new Asset() ) ) {
		var swap = false;
		for ( var i = 0; i < this.assets.length; i++ ) {
			if ( swap ) { 
				this.assets[i - 1] = this.assets[i];
			}
			
			if ( this.assets[i].uid == asset.uid ) 
				swap = true;
		}
		
		if ( swap ) {
			this.assets.length -= 1;
		}
	}
}

Scene.prototype.setDrawHud = function( callback ) {
	this.onDrawHud = callback;
}

Scene.prototype.getPlanet = function() {
	var planet = null;
	var planet_mass = 0;
	
	for ( var i = 0; i < this.assets.length; i++ ) {
		if ( this.assets[i].mass > planet_mass ) {
			planet = this.assets[i];
			planet_mass = this.assets[i].mass;
		}
	}
	
	return planet;
}