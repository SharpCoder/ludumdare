// 2014-08-22
// SharpCoder
// This is the core framework for my ludum dare 30 entry.

Drawable = function(config) {

	config = config || {};
	this.x = config.x || 0;
	this.y = config.y || 0;
	this.vx = config.vx || 0;
	this.vy = config.vy || 0;
	this.ox = config.ox || 0;
	this.oy = config.oy || 0;
	this.width = config.width || 0;
	this.height = config.height || 0;
	this.scale = config.scale || 1.0;
	this.text = config.text || '';
	this.visible = config.visible;
	this.font = config.font || "12pt 'Francois One'";
	this.fontColor = config.fontColor || '#ffffff';
	this.name = config.name || '';

	this.animate = false;
	this.animations = config.animations || new Array();
	this.animation_index = 0;
	
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

	// Trigger some events.
	this.doInvoke("onload");

};

Drawable.prototype.isCollided = function(x, y) {
	var dx = this.x;
	var dy = this.y - this.height;
	if ( x > dx && y > dy && x < (dx + this.width) && y < (dy + this.height) )
		return true;

	return false;
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
	this.x += this.vx;
	this.y += this.vy;

	// *************
	// GRAVITY HERE
	if ( this.gravity_standard ) { 

		// Find the source.
		var gConst = 0.000001;
		var mSource = 10000000;
		var mSelf = 100;
		var source = Framework.GetGravitySource();
		if ( source !== undefined && source !== null ) { 
			var distance = Math.sqrt( Math.pow( this.x - source.x, 2 ) + Math.pow( this.y - source.y, 2 ));
			var force = gConst * ((mSource * mSelf) / Math.pow(distance,2));
			if ( this.x > (source.x)) { 
				this.vx -= force;
			} else {
				this.vx += force;
			}

			if ( this.y > source.y  ) { 
				this.vy -= force;
			} else {
				this.vy += force;
			}
		}
	}
	// *************

	// Update the assets.
	this.doInvoke("onupdateassets");
	for ( var i = 0; i < this.assets.length; i++ ) {
		this.assets[i].doUpdate.call(this.assets[i]);
	}
};

Drawable.prototype.doDraw = function( ctx ) {
	if ( !this.visible ) return;

	if ( this.animate ) { 
		this.animation_count = (this.animation_count || 5) - 1;
		if ( this.animation_count <= 0 ) { 
			if ( this.animation_index > this.animations.length ) { 
				this.doInvoke("onafteranimation");
			} else { 
				this.image = Assets.Get(this.animations[this.animation_index]);
				this.animation_index = (this.animation_index + 1);
				this.animation_count = 5;
			}
		}
	}

	if ( this.image !== undefined && this.image !== null ) {
		if ( this.rotation === undefined || this.rotation === null ) { 
			ctx.drawImage(this.image, this.x + this.ox, this.y + this.oy, this.image.width * this.scale, this.image.height * this.scale);
		} else {
			var cx = this.x;
			var cy = this.y;
			var px = this.x - (this.image.width / 2) + this.rox;
			var py = this.y - (this.image.height / 2) + this.roy;
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(this.rotation * Math.PI / 180);
			ctx.translate(-cx, -cy);
			ctx.drawImage(this.image, px + this.ox, py + this.oy, this.image.width * this.scale, this.image.height * this.scale);
			ctx.restore();
		}
	}

	if ( this.text !== undefined && this.text !== null && this.text.length > 0 ) {
		ctx.font = this.font;
		ctx.fillStyle = this.fontColor;
		ctx.fillText( this.text, this.x + this.ox, this.y + this.oy );
	}

	// Draw the assets.
	this.doInvoke("ondraw", ctx);
	this.doInvoke("ondrawassets");
	for ( var i = 0; i < this.assets.length; i++ ) {
		this.assets[i].doDraw.call( this.assets[i], ctx );
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

Framework = (function() {

	var active_scene = null;
	var scenes = new Array();
	var ctx;

	return {

		Initialize: function() {
			var canvas = document.getElementById('canvas');
			ctx = canvas.getContext('2d');
		},

		LoadScene: function( name ) {
			for ( var i = 0; i < scenes.length; i++ ) {
				if ( scenes[i].name === name ) {
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
				active_scene.doInvoke.call(active_scene, "onreset");
			}
		},

		DoDraw: function() {

			if ( active_scene !== undefined && active_scene !== null ) {
				if ( active_scene.doDraw !== undefined ) {
					ctx.clearRect(0, 0, 800, 800);
					active_scene.doDraw.call(active_scene, ctx);
				}
			}
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

		DoUpdate: function() {

			if ( active_scene !== undefined && active_scene !== null ) {
				if ( active_scene.doUpdate !== undefined ) {
					active_scene.doUpdate.call(active_scene);
				}
			}

		},

		GetGravitySource: function() {
			if ( active_scene !== undefined && active_scene !== null ) {
				for ( var i = 0; i < active_scene.assets.length; i++ ) { 
					if ( active_scene.assets[i].gravity_source ) {
						return active_scene.assets[i];
					}
				}
			}
		}

	};

})();