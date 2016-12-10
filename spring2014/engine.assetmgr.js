// engine.asset.js
// The asset manager for my engine
// Created by SharpCoder
// 2014-04-25

AssetManager = (function() {
	return {
		images: {},
		loaded: false,
		precache: function( callback ) {
			var image_list = [
				"planet_core.png",
				"star_bg.png",
				"ship.png",
				"ship_move.png",
				"planet_node_target.png",
				"planet_node.png",
				"planet1.png",
				"planet2.png",
				"planet3.png",
				"planet4.png",
				"menu_bg.png",
				"explosion_1.png",
				"explosion_2.png",
				"explosion_3.png",
				"explosion_4.png",
				"explosion_5.png",
				"core.png",
				"core_disabled.png",
				"map_hud.png",
				"score_hud.png",
				"btn_retry.png",
				"btn_retry_inverse.png",
				"dialog_hud.png",
				"instructions_hud.png",
				"bullet.png",
				"asteroid.png"
			]
			
			var index = 0;
			function process() {
				if ( index >= image_list.length ) {
					if ( callback !== undefined )
						callback();
						
					AssetManager.loaded = true;
					return;
				}
				
				var src = image_list[index++];
				var img = new Image();
				img.onload = process;
				img.src = src;
				AssetManager.images[src] = img;
			}
			
			process();
		},
		getImage: function( src ) {
			if ( AssetManager.images[src] !== undefined ) return AssetManager.images[src];
			var img = new Image();
			img.src = src;
			AssetManager.images[src] = img;
			return AssetManager.images[src];
		}
	};
	
})();
