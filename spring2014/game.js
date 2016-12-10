// game.js
// The game definition file.
// Created by SharpCoder
// 2014-04-25
$(document).ready(function() {

	// Cache the things.
	AssetManager.precache(function() {
		SoundManager.precache();
		
		var money = 5000, ammo = 25, weapon = "Missile";
		var canvas = document.getElementById('primary_canvas');
		var ctx = canvas.getContext('2d');
		
		setTimeout( function() {
			Engine.init( canvas );
			GameLogic.init();
			
			function draw_core() {
				Engine.doDraw( ctx );
				
				// Schedule again.
				setTimeout( draw_core, 30 );
			}
			
			function update_core() {
				Engine.doUpdate();
				setTimeout( update_core, 30 );
			}
			
			// Remove the loading bar.
			$("#msgLoading").css("display", "none");
			
			// Call the methods.
			draw_core();
			update_core();
			
			// Disable select text.
			$(document).attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false);
			
			// Mouse move event.
			$(document).on('mousemove', function(conf) {
				Engine.triggerMouseMove( conf.offsetX, conf.offsetY );
			});
			
			$(document).on('dblclick', function ( evt ) {
				evt.preventDefault();
			});
			
			$(document).on('click', function( evt ) {
				evt.preventDefault();
				Engine.triggerMouseDown();
			});
			
			$(document).on('keydown', function ( evt ) {
				evt.preventDefault();
				Engine.triggerKeyDown( evt.which );
			});
			
			$(document).on('keyup', function ( evt ) {
				evt.preventDefault();
				Engine.triggerKeyUp( evt.which );
			});
		
			
		}, 100);
	});
});