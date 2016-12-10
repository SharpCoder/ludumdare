
// Globals
var world;

Drawable = function(config) {

	config = config || {};
	this.topMost = config.topMost;
	this.canShow = false;
	this.ox = config.ox || 0;
	this.oy = config.oy || 0;
	this.px = config.x || 0;
	this.py = config.y || 0;
	this.width = config.width || 0;
	this.height = config.height || 0;
	this.scale = config.scale || 1.5;
	this.text = config.text || '';
	this.visible = config.visible;
	this.font = config.font || "12pt 'Indie Flower'";
	this.fontColor = config.fontColor || '#ffffff';
	this.name = config.name || '';
	this.gravity = config.gravity;
	this.inactive = config.inactive;
	this.loaded = false;
	this.playOnce = false;
	this.playFlipped = false;
	this.physObj2 = config.physObj2;

	if ( this.topMost == undefined )
		this.topMost = false;

	if ( this.inactive == undefined || this.inactive == null )
		this.inactive = false;

	if ( this.gravity === undefined )
		this.gravity = true;

	this.animation_state;
	this.animate = config.animated;
	this.animation_set = {};
	this.animation_index = 0;
	this.animation_cooldown = 0;

	// The gravity standard follow the gravity sources.
	this.gravity_source = config.gravity_source || false;
	this.gravity_standard = config.gravity_standard || false;

	this.rotation = config.rotation;
	this.rox = config.rox || 0; // Rotation offset x.
	this.roy = config.roy || 0; // Rotation offset y.
	this.assets = new Array();
	this.parent = null;
	this.events = {};

	this.visible = (this.visible === undefined) ? true : this.visible;
	if ( config.listeners !== undefined && config.listeners !== null ) {
		for ( var prop in config.listeners ) {
			if ( config.listeners.hasOwnProperty(prop) ) {
				this.events[prop] = config.listeners[prop];
			}
		}
	}

	// Load the image, if applicable.
	if ( config.image !== undefined && config.image !== null ) {
		this.image = Assets.Get(config.image);
		if ( this.width === 0 )
			this.width = this.image.width;
		if ( this.height === 0 )
			this.height = this.image.height;
	}

	// Create the physics body
	var zoom = 1;//800;
	if ( this.gravity )  {
		this.physObj = new p2.Body({
			mass: (this.inactive) ? 0 : 1,
			label: config.name,
			position: [this.px, this.py]
		});

		var wX = (this.width || 8);
		var wH = (this.height || 8);

		this.physObj.addShape(new p2.Rectangle(wX,wH));
	}


	// Trigger some events.
	this.doInvoke("onload");

};

Drawable.prototype.addAnimation = function(name, images) {
	this.animation_set[name] = images;
	if ( this.animation_state == undefined )
		this.animation_state = name;
}

Drawable.prototype.setAnimation = function(state, once) {

	// Don't do anything if we're already on the state.
	if ( this.playOnce ) return;
	if ( this.animation_state === state ) return;
	once = once || false;

	this.playOnce = once;
	this.animation_state = state;
	this.animation_index = 0;
	this.animation_cooldown = 0;
}

Drawable.prototype.x = function(newVal) {

	if ( newVal !== undefined ) {
		if ( this.physObj )
			this.physObj.position[0] = newVal;
		else
			this.px = newVal;
	}

	if ( this.physObj )
		return this.physObj.position[0] + this.rox;
	return this.px;
}

Drawable.prototype.y = function(newVal) {
	if ( newVal !== undefined ) {
		if ( this.physObj !== undefined ) {
			this.physObj.position[1] = newVal;
		} else {
			this.py = newVal;
		}
	}
	if ( this.physObj )
		return 780 + (this.physObj.position[1] * -1) + this.roy;
	return this.py;
}

Drawable.prototype.vx = function() {
	if ( this.physObj )
		return this.physObj.velocity[0];
	return 0;
}

Drawable.prototype.vy = function() {
	if ( this.physObj )
		return this.physObj.velocity[1];
	return 0;
}

Drawable.prototype.doInvoke = function(evt, arg1, arg2) {
	if ( this.events !== undefined && this.events !== null ) {
		if ( this.events[evt] !== undefined && this.events[evt] !== null ) {
			this.events[evt].call(this, arg1, arg2);
		}
	}

	// Bubble the events down.
	for ( var i = 0; i < this.assets.length; i++ ) {
		this.assets[i].doInvoke.call( this.assets[i], evt, arg1, arg2 );
	}
}

Drawable.prototype.doInvokeUp = function(evt, arg1, arg2) {
	if ( this.parent !== undefined && this.parent !== null ) {
		if ( this.parent.events[evt] !== undefined && this.parent.events[evt] !== null ) {
			this.parent.events[evt].call(this, arg1, arg2);
		}

		this.parent.doInvokeUp.call( this.parent, evt, arg1, arg2 );
	}
}

Drawable.prototype.doUpdate = function() {
	this.doInvoke("onupdate");

	if ( this.vx() < 0 )
		this.playFlipped = true;
	else if ( this.vx() > 0)
		this.playFlipped = false;

	// If we're the top level item
	var camera = Framework.GetCamera();

	//var nx = (other.physObj.position[0] - (camera.x - camera.virtualX));
	//this.rox = (camera.virtualX - camera.x);//camera.rumbleOx - camera.x;
	this.rox = (camera.virtualX - camera.x);//(this.x() - (this.width/2)) - camera.virtualX)

	//this.roy = camera.rumbleOy - camera.y;
	if ( !this.loaded ) {
		this.loaded = true;
		if ( this.physObj !== undefined ) {
			var world = Framework.GetWorld();
			world.addBody(this.physObj);
		}
		this.doInvoke("onafterload");
	}

	// Update the assets.
	this.doInvoke("onupdateassets");
	for ( var i = 0; i < this.assets.length; i++ ) {
		this.assets[i].doUpdate.call(this.assets[i]);
	}
};

Drawable.prototype.doDraw = function( ctx ) {
	if ( !this.visible ) return;
	if ( !this.canShow ) return;

	if ( this.animate ) {
		if ( this.animation_cooldown-- < 0 ) {

			this.animation_cooldown = 4;
			this.image = Assets.Get(this.animation_set[this.animation_state][this.animation_index]);

			if ( this.playOnce ) {
				this.animation_index = (this.animation_index + 1);
				if ( this.animation_index >= this.animation_set[this.animation_state].length) {
					if ( this.animation_set["idleSword"] !== undefined )
						this.animation_state = "idleSword";

					this.playOnce = false;
					this.animation_index = 0;
					this.doInvoke("onanimationover");
				}
			} else {
				this.animation_index = (this.animation_index + 1) % this.animation_set[this.animation_state].length;
			}
		}
	}


	if ( this.image !== undefined && this.image !== null ) {

			var cx = this.x();
			var cy = this.y();
			var px = this.x() - (this.image.width / 2);
			var py = this.y() - (this.image.height / 2);
			var flipH = (this.vx() < 0) || this.playFlipped;

			// Save the context.
			ctx.save();

			// Check if we need to rotate.
			if ( this.rotation !== undefined || flipH ) {
				ctx.translate(cx, cy);

				if ( this.rotation !== undefined && this.rotation !== null ) {
					ctx.rotate(this.rotation * Math.PI / 180);
				}
				// Determine the scale for flipping
				ctx.scale(flipH ? -1 : 1,1);

				// Set things back
				ctx.translate(-cx, -cy);
			}

			// Draw the image.
			ctx.drawImage(this.image, px + this.ox, py + this.oy, this.image.width * this.scale, this.image.height * this.scale);
			ctx.restore();
	}

	if ( this.text !== undefined && this.text !== null && this.text.length > 0 ) {
		ctx.font = this.font;
		ctx.fillStyle = this.fontColor;
		ctx.fillText( this.text, this.x() + this.ox, this.y() + this.oy );
	}

	// Draw the assets.
	this.doInvoke("ondraw", ctx);
	this.doInvoke("ondrawassets");

	// Draw topmost last.
	for ( var i = 0; i < this.assets.length; i++ ) {
		if ( this.assets[i].topMost == false ) {
			this.assets[i].doDraw.call( this.assets[i], ctx );
		}
	}

	for ( var i = 0; i < this.assets.length; i++ ) {
		if ( this.assets[i].topMost == true ) {
			this.assets[i].doDraw.call( this.assets[i], ctx );
		}
	}
};

Drawable.prototype.hide = function() {
	this.visible = false;
}

Drawable.prototype.getAsset = function(name) {
	for ( var i = 0; i < this.assets.length; i++ ) {
		if ( this.assets[i].name == name )
			return this.assets[i];
	}
}

Drawable.prototype.removeAsset = function( drawable ) {
	var swap = false;
	var items = new Array();
	for ( var i = 0; i < this.assets.length; i++ ) {
		if ( this.assets[i] !== drawable )
			items.push(this.assets[i]);
	}
	delete this.assets;
	this.assets = items;
}

Drawable.prototype.addAsset = function( drawable ) {
	this.doInvoke("onaddasset");
	if ( drawable !== undefined && drawable !== null ) {
		this.assets.push(drawable);
		drawable.parent = this;
	}
}

Drawable.prototype.getPhysicsObject = function() {
	return this.physObj;
}

Drawable.prototype.setVX = function(vx) {
	this.physObj.velocity[0] = vx;
}

var yAxis = p2.vec2.fromValues(0,1);
Drawable.prototype.checkIfCanJump = function() {
  var result = false;
  for(var i=0; i< world.narrowphase.contactEquations.length; i++){
    var c = world.narrowphase.contactEquations[i];
    if(c.bodyA === this.physObj || c.bodyB === this.physObj){
      var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
      if(c.bodyA === this.physObj) d *= -1;
      if(d > 0.5) result = true;
    }
  }
  return result;
}


Drawable.prototype.jump = function() {
	var jumpSpeed = 700.5;
	if(this.checkIfCanJump()) {
		this.physObj.velocity[1] = jumpSpeed;
	}

}

Drawable.prototype.activate = function() {

	if ( this.physObj !== undefined ) {
		var px = this.physObj.position[0];
		var py = this.physObj.position[1];

		var world = Framework.GetWorld();
		world.removeBody(this.physObj);
		delete this.physObj;

		this.physObj = new p2.Body({
			mass: 1.0,
			angularForce: Math.random(),
			position: [px,py]
		});
		function normalizeAngle(angle){
        angle = angle % (2*Math.PI);
        if(angle < 0){
            angle += (2*Math.PI);
        }
        return angle;
    }

		this.physObj.addShape(new p2.Rectangle(0,0));
		world.addBody(this.physObj);

		var fX = (Math.random() - Math.random()) * 5;
		var fY = (Math.random() - Math.random()) * 5;

		this.physObj.applyForce([fX,fY], [this.width/2,this.height/2]);//this.x(),this.y()]);
		this.physObj.collisionResponse = false;
		this.inactive = false;
	}

	for ( var i =0; i < this.assets.length; i++ )
		this.assets[i].activate.call( this.assets[i] );

	this.doInvoke("onactivated");
}

Drawable.prototype.findAssetByBody = function(edge) {
	if ( this.physObj === edge || this.physObj2 == edge )
		return this;

	for ( var i = 0; i < this.assets.length; i++ ) {
		var result = this.assets[i].findAssetByBody(edge);
		if ( result !== undefined )
			return result;
	}
	return undefined;
}

Camera = function(config) {
	// Absolute position on screen
	this.x = config.x || 0;
	this.y = config.y || 0;

	// Rumble and other effects.
	this.rumble = false;
	this.rumbleTimer = 100;
	this.rumbleOx = this.x;
	this.rumbleOy = this.y;
	this.rumbleVx = 0;
	this.rumbleVy = 0;

	// Zoom
	this.zoom = false;
	this.zoomUp = 15;
	this.zoomDown = 15;
	this.zoomOx = this.x;
	this.zoomOy = this.y;

	// Actual world position, top-left style
	this.virtualX = config.virtualX || 0;
	this.virtualY = config.virtualY || 0;
	this.width = config.width || 800;
	this.height = config.height || 800;
};

Camera.prototype.doZoom = function() {
	if ( this.zoom ) return;

	if ( this.rumble ) {
		this.zoomOx = this.rumbleOx;
		this.zoomOy = this.rumbleOy;
	} else {
		this.zoomOx = this.x;
		this.zoomOy = this.y;
	}

	this.zoomUp = 15;
	this.zoomDown = 64;
	this.zoom = true;
}

Camera.prototype.doRumble = function() {
	if ( this.zoom ) {
		this.rumbleOx = this.zoomOx;
		this.rumbleOy = this.zoomOy;
	} else {
		this.rumbleOx = this.x;
		this.rumbleOy = this.y;
	}

	this.rumbleTimer = 10;
	this.rumble = true;
};

Camera.prototype.update = function() {
	if ( this.rumble ) {
		this.x += this.rumbleVx;
		this.y += this.rumbleVy;

		if ( this.rumbleTimer-- < 0 ) {
			this.rumble = false;
			this.rumbleTimer = 10;
			this.x = this.rumbleOx;
			this.y = this.rumbleOy;
		} else {
			this.rumbleVx = (Math.random() - Math.random()) * 10;
			this.rumbleVy = (Math.random() - Math.random()) * 10;
		}
	}

	if ( this.zoom ) {
		if ( this.zoomUp-- < 0 ) {
			Framework.SetStep(0.003);
			if ( this.zoomDown-- < 0 ) {
				this.zoom = false;
				this.zoomDown = 44;
				this.zoomUp = 15;

				this.x = this.zoomOx;
				this.y = this.zoomOy;
			}
		}
	}

};

Camera.prototype.filter = function(asset) {


	if ( this.zoom ) {
		if ( this.zoomUp > 0 ) {
			if ( asset.parent == null || asset.parent == undefined ) {
				// Toplevel
				asset.ox = (this.x - this.virtualX + (asset.width/2) *  (1.5 - asset.scale));
				asset.oy = (asset.oy - 5)  * 1.3;
			} else {
				if ( asset.name != "player" ) {
					asset.ox = (asset.width / -2) * asset.scale;
				}
			}

			asset.scale += 0.1;
			this.virtualY -= 0.5;
		}
	} else {
		asset.scale = 1.5;
		asset.oy = 0;
		asset.ox = 0;
		Framework.SetStep(1/60.0);
	}

	var vw = asset.width;
	var vh = asset.height;

	var vx = this.virtualX - vw;
	var vxx = this.virtualX + this.width + vw;
	var vy = this.virtualY - vh;
	var vyy = this.virtualY + this.height + vh;

	var ax = asset.x();
	var ay = asset.y();

	if ( ax > vx && ax < vxx && ay > vy && ay < vyy ) {
		asset.canShow = true;
	} else {
		asset.canShow = true;
	}

	for ( var i = 0; i < asset.assets.length; i++ )
		this.filter.call(this, asset.assets[i]);
}

Camera.prototype.draw = function(ctx) {
	ctx.strokeRect(this.x,this.y,this.width,this.height);
}

Framework = (function() {

	// Initialize the physics engine.
	var events = {};
	var active_scene = null;
	var scenes = new Array();
	var ctx;
	var physicsObjects = [];
	var worldPlane;
	var step = 1/60.0;
	var score;

	// Initialize the camera.
	var camera = new Camera({
		x: 0,
		y: 0,
		virtualX: 0,
		virtualY: 0,
		width: 400,
		height: 400
	});

	function loadPhysicsScene(drawable){
		// Add the object to the list.
		if ( drawable.gravity )
			physicsObjects.push(drawable.getPhysicsObject());

		// Drill down the asset.
		if ( drawable.assets != undefined && drawable.assets.length > 0 ) {
			for ( var i = 0; i < drawable.assets.length; i++ ) {
				loadPhysicsScene(drawable.assets[i]);
			}
		}
	}

	return {

		SetStep: function(s) {
			step = s;
		},

		UpdateCamera: function(x,y,vx,vy,width,height) {
			camera.x = x;
			camera.y = y;
			camera.virtualX = vx;
			camera.virtualY = vy;
			camera.rumbleOx = x;
			camera.rumbleOy = y;
			camera.width = width;
			camera.height = height;
		},

		FindAssetByBody: function(body) {
			return active_scene.findAssetByBody(body);
		},

		Rumble: function() {
			if ( camera.rumble ) return;
			camera.doRumble();
		},

		GetCamera: function() {
			return camera;
		},

		GetWorld: function() {
			return world;
		},

		AddListener: function(name, evt) {
			events[name] = evt;
		},

		FireEvent: function(name) {
			if ( events[name] !== undefined )
				events[name].call(this);
		},

		Initialize: function() {
			var canvas = document.getElementById('canvas');
			ctx = canvas.getContext('2d');

			this.FireEvent("onload");
		},

		RemoveScene: function(name) {
			for ( var i = 0; i < scenes.length; i++ ) {
				if ( scenes[i].name == name ) {
					var scene = scenes[i];
					delete scene;
					return;
				}
			}
		},

		LoadScene: function( name ) {
			for ( var i = 0; i < scenes.length; i++ ) {
				if ( scenes[i].name === name ) {
					// Get the info.
					loadPhysicsScene(scenes[i]);

					// Create a physics world, where bodies and constraints live
					world = new p2.World({
						gravity: [0,-9.8 * (160)]
					});
	        world.defaultContactMaterial.friction = 0;
	        world.setGlobalStiffness(1e5);

					// Create an infinite ground plane.
					var plane = new p2.Plane();
					worldPlane = new p2.Body({
					    position: [0,90]
					});
					worldPlane.addShape(plane);
					world.addBody(worldPlane);

					world.on("beginContact",function(event){
						active_scene.doInvoke("oncollision", event);
	        });

					active_scene = scenes[i];
					active_scene.doInvoke.call(active_scene, "onreset");

					return;
				}
			}
		},

		AddScene: function( scene ) {
			scenes.push( scene );
			if ( active_scene === null || active_scene === undefined ) {
				active_scene = scene;
				this.LoadScene(active_scene.name);
				active_scene.doInvoke.call(active_scene, "onreset");
			}
		},

		DoDraw: function() {
			if ( active_scene !== undefined && active_scene !== null ) {
				if ( active_scene.doDraw !== undefined ) {
					ctx.clearRect(0, 0, 800, 800);
					ctx.imageSmoothingEnabled = false;
					ctx.mozImageSmoothingEnabled = false;

					/// draw the shape we want to use for clipping
					ctx.save();
					ctx.fillStyle="#fff";
					ctx.beginPath();
					ctx.moveTo(camera.x, camera.y);
					ctx.lineTo(camera.x + camera.width, camera.y);
					ctx.lineTo(camera.x + camera.width, camera.y + camera.height);
					ctx.lineTo(camera.x, camera.y + camera.height);
					ctx.lineTo(camera.x,camera.y);
					ctx.closePath();

					// Mask
					ctx.clip();

					// Update the position based on the camera
					// settings. This is needed for rumble.
					active_scene.x(camera.virtualX);
					active_scene.doDraw.call(active_scene, ctx);

					ctx.restore();
					camera.draw(ctx);
				}
			}
		},

		GetActiveScene: function() {
			return active_scene;
		},

		SaveContext: function() {
			try {
			    if ('localStorage' in window && window['localStorage'] !== null) {
			    	localStorage["context"] = JSON.stringify(this.GetContext());
			    }
			} catch (e) { }
		},

		LoadContext: function() {
			try {
			    if ('localStorage' in window && window['localStorage'] !== null) {
			    	this.SetContext(JSON.parse(localStorage["context"]));
			    }
			} catch (e) { }
		},

		SetContext: function( obj ) {
			this.context = obj;
		},

		GetContext: function() {
			return this.context;
		},

		DoKeyDown: function(key) {
			if ( active_scene !== undefined && active_scene !== null ) {
				active_scene.doInvoke.call( active_scene, "onkeydown", key);
			}
		},

		DoKeyUp: function(key) {
			if ( active_scene !== undefined && active_scene !== null ) {
				active_scene.doInvoke.call( active_scene, "onkeyup", key);
			}
		},

		DoMouseDown: function(x, y) {
			if ( active_scene !== undefined && active_scene !== null ) {
				active_scene.doInvoke.call( active_scene, "onmousedown", x, y);
			}
		},

		DoMouseMove: function(x, y) {
			if ( active_scene !== undefined && active_scene !== null ) {
				active_scene.doInvoke.call( active_scene, "onmousemove", x, y);
			}
		},

		GetScore: function() {
			return score;
		},

		SetScore: function(s) {
			score = s;
		},

		DoUpdate: function() {
			world.step(step);//1/60.0);
			if ( active_scene !== undefined && active_scene !== null ) {
				if ( active_scene.doUpdate !== undefined ) {
					camera.filter(active_scene);
					camera.update();
					active_scene.canShow = true;
					active_scene.doUpdate.call(active_scene);
				}
			}

		}

	};

})();
