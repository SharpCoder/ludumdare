// engine.asset.js
// The asset definition for my engine
// Created by SharpCoder
// 2014-04-25

Asset = function( config ) {
	config = config || {};
	
	this.config = config;
	this.uid = Engine.generateUID();
	this.name = config.name || "";
	this.text = config.text || "";
	this.textColor = config.textColor || "#FFFFFF";
	this.font = config.font || "12pt Electrolize";
	this.x = config.x || 0;
	this.y = config.y || 0;
	this.vx = config.vx || 0;
	this.vy = config.vy || 0;
	this.mass = config.mass || 0;
	this.angle = config.angle || 0;
	this.gravity = config.gravity || false;
	this.speed = config.speed || 1;
	this.isHovered = false;
	this.attributes = config.attributes || {};
	this.detectKeys = config.detectKeys || false;
	this.detectCollision = config.detectCollision || false;
	
	// Gravity
	this.gForce = 0;
	this.gTarget = null;
	this.gTargetMass = 0;
	this.gTargetDistance = 0;
	
	// Other stuff
	this.width = config.width || 0;
	this.height = config.height || 0;
	this.client_update = config.doUpdate || null;
	this.visible = true;
	this.update = true;
	if ( $.trim( config.src ).length > 0 ) {
		this.setImage( config.src || '' );
	}
	
	// Event System
	var listeners = config.listeners || {};
	this.onBeforeDraw = listeners.onBeforeDraw || function( ctx ) { return true; };
	this.onMouseMove = listeners.onMouseMove || function(x, y) { };
	this.onMouseDown = listeners.onMouseDown || function() { };
	this.onUpdate = listeners.onUpdate || function() { };
	this.onDraw = listeners.onDraw || function( ctx ) { };
	this.onClick = listeners.onClick || function() { };
	this.onKeyDown = listeners.onKeyDown || function( key ) { };
	this.onKeyUp = listeners.onKeyUp || function( key ) { };
	this.onLoad = listeners.onLoad || function() { };
	
	// Animation stuff.
	this.animation_frame = 0;
	this.animation_delay = 0;
	this.animation_loop = config.animation_loop || false;
	this.animation_ended = false;
	this.animation_images = new Array();
	
	// Call the onload function.
	this.onLoad();
}

Asset.prototype.addAnimation = function( src ) {
	var image = new Image();
	image.src = src;
	this.animation_images.push( image );
}

Asset.prototype.setImage = function(src) {
	
	// Invisible until loaded.
	var img = AssetManager.getImage( src );
	this.image = img;
	this.src = src;
	if ( img.width == 0 || img.height == 0 ) {
		var self = this;
		setTimeout( function() {
			self.width = img.width;
			self.height = img.height;
		}, 25);
	} else {
		this.width = img.width;
		this.height = img.height;
	}	
}

Asset.prototype.doUpdate = function() {
	
	if ( !this.update ) return;
	
	if ( this.client_update !== null ) {
		this.client_update();
	} else {
		// If we should calculate gravity,
		// do so.
		var max_gravity = 1;
		if ( this.gravity && this.gTarget !== null && this.gTarget !== undefined ) {
			
			var uvx = Math.round( this.gTarget.x - this.x );
			var uvy = Math.round( this.gTarget.y - this.y );
			var gcm = lcm( uvx, uvy );
			uvx /= gcm;
			uvy /= gcm;
			
			if ( this.gTargetDistance > 150 ) 
				this.speed = Math.min( this.gForce, 1.5 );
				
			this.text = Math.round( this.speed * 100 ) / 100;
			this.vx += ( this.x > this.gTarget.x ) ? -this.speed : this.speed;
			this.vy += ( this.y > this.gTarget.y ) ? -this.speed : this.speed;
		}
		
		this.x += this.vx;
		this.y += this.vy;
	}
	
	if ( this.onUpdate !== undefined ) 
		this.onUpdate();
		
	// Check for animation stuff.
	if ( this.animation_images.length > 0 ) {
		if ( this.animation_frame + 1 >= this.animation_images.length ) {
			// Check for loop condition.
			if ( this.animation_loop ) {
				this.animation_frame = 0;
			} else {
				this.animation_ended = true;
			}
		} else {
			if ( this.animation_delay-- < 0 ) {
				this.animation_frame++;
				this.animation_delay = 2;
			}
		}		
	}
		
	return true;
};

Asset.prototype.doDraw = function( ctx ) {
	if ( this.shouldDraw() && this.onBeforeDraw( ctx )) {
		if ( this.image !== undefined ) {
			var image = this.image;
			if ( this.animation_images.length > 0 ) {
				if ( this.animation_images[this.animation_frame] !== undefined )
					image = this.animation_images[this.animation_frame];
			}
			
			if ( this.angle != 0 ) {
				ctx.save();
				ctx.translate( this.x, this. y); 
				ctx.rotate( ( this.angle * 4 ) / Math.PI );
				ctx.drawImage( image, -(this.width/2), -(this.height/2));
				ctx.restore();
			} else {
				ctx.save();
				ctx.drawImage( image, this.x - ( this.width / 2 ), this.y - ( this.height / 2 ) );			
				ctx.restore();
			}
		} 
		
		if ( $.trim( this.text ).length > 0 ) { 
			ctx.font = this.font;
			ctx.save();
			ctx.fillStyle = this.textColor;
			ctx.fillText( this.text, this.x, this.y );
			ctx.restore();
		}
	}
};

Asset.prototype.shouldDraw = function() {
	return this.visible;
};