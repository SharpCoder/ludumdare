// 2014-08-22
// SharpCoder
// This is the asset manager for my ludum dare 30 entry.
Assets = (function() {

	var images = [
		'shiroe.png',
		'shiroe_Walk_0.png',
		'shiroe_Walk_1.png',
		'shiroe_Walk_2.png',
		'shiroe_Fall_0.png',
		'shiroe_Attack_1.png',
		'shiroe_Attack_2.png',
		'shiroe_Attack_3.png',
		'shiroe_Attack_4.png',
		'shiroe_Attack_5.png',
		'shiroe_FallSide_0.png',
		'shiroe_IdleSword_0.png',
		'shiroe_WalkSword_0.png',
		'shiroe_WalkSword_1.png',
		'shiroe_WalkSword_2.png',
		'shiroe_FallSword_0.png',
		'shiroe_FallSideSword_0.png',
		'arena.png',
		'sword.png',
		'ground.png',
		'ashenfloor.png',
		'hell.png',
		'gameover.png',
		'zombie_Walk_0.png',
		'zombie_Walk_1.png',
		'zombie_Walk_2.png',
		'zombie_Idle_0.png',
		'zombie_Die_0.png',
		'zombie_Die_1.png',
		'zombie_Die_2.png',
		'zombie_Die_3.png'
	];

	var sounds = [];

	var loaded = {};
	var loaded_sound = {};
	var index = 0;

	function process_sound( i, callback ) {
		if ( i >= sounds.length ) {
			if ( callback !== undefined && callback !== null )
				callback.call(this);
			return;
		}

		var sound = new Audio('./sounds/' + sounds[i]);
		loaded_sound[sounds[i]] = sound;
		process_sound(i + 1, callback);
	}

	function process( i, callback ) {
		if ( i >= images.length ) {
			process_sound( 0, callback );
			return;
		}

		var image = new Image();
		image.onload = function() {
			process( i + 1, callback );
		};
		image.src = './framework/assets/' + images[i];
		loaded[images[i]] = image;
	}

	return {
		Initialize: function( callback ) {
			process(0, callback);
		},
		Get: function(asset) {
			if ( loaded[asset] !== undefined && loaded[asset] !== null ) {
				return loaded[asset];
			}
		},
		GetAudio: function( asset ) {
			var audio_test = new Audio();
			if ( audio_test.canPlayType( "audio/wav" )) {
				try {
					// Make sure it's the wav type.
					asset = asset.replace(".mp3", ".wav");
					return loaded_sound[asset];
				} catch ( ex ) {}
			} else if ( audio_test.canPlayType( "audio/mp3" )) {
				try {
					asset = asset.replace(".wav", ".mp3");
					return loaded_sound[asset];
				} catch ( ex ) { }
			}
		},
		PlayAudio: function( audio_object, volume, loop ) {
			volume = volume || 1.0;
			loop = loop || false;
			if ( audio_object !== undefined && audio_object !== null ) {
				audio_object.volume = volume;
				audio_object.loop = loop;
				audio_object.play();
			}
		},
		Play: function( asset, volume, loop ) {
			volume = volume || 1.0;
			loop = loop || false;
			var sound = Assets.GetAudio( asset );
			if ( sound !== undefined && sound !== null ) {
				sound.volume = volume;
				sound.loop = loop;
				sound.play();
			}
		}
	};

})();
