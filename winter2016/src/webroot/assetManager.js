// 2014-08-22
// SharpCoder
// This is the asset manager for my ludum dare 30 entry.
Assets = (function() {

	var images = [
    'ball.png'
	];

	var sounds = [
	];

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
		image.src = './assets/' + images[i];
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
		},
		PlayInstant: function( asset, volume, loop ) {
			volume = volume || 1.0;
			loop = loop || false;
			var sound = new Audio(Assets.GetAudio( asset ).src);
			if ( sound !== undefined && sound !== null ) {
				sound.volume = volume;
				sound.loop = loop;
				sound.play();
			}
		}
	};

})();
