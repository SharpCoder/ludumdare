// game.soundmgr.js
// The game sound definitions.
// Created by SharpCoder
// 2014-04-27

SoundManager = (function() {

	var mp3 = {};
	var wav = {};
	
	return {
		precache: function() {
			try {
				var sound_wav = [
					'shoot1.wav',
					'shoot2.wav',
					'explosion1.wav',
					'explosion2.wav',
					'explosion3.wav'
				];
				
				var sound_mp3 = [];
				
				for ( var i = 0; i < sound_wav.length; i++ ) {
					wav[sound_wav[i]] = new Audio( sound_wav[i] );
				}
				
				for ( var i = 0; i < sound_mp3.length; i++ ) {
					mp3[sound_mp3[i]] = new Audio( sound_mp3[i] );
				}
			} catch ( ex ) { }
		},
		getSound: function( src ) {
			if ( (new Audio()).canPlayType( "audio/wav" ) ) {
				// get the wav cached one.
				try {
					if ( wav[src] == undefined )
						wav[src] = new Audio( src );
					return wav[src];
				} catch ( ex ) { }
			} else if ((new Audio()).canPlayType( "audio/mp3" )) {
				try {
					src = src.replace(".wav", ".mp3");
					if ( mp3[src] == undefined )
						mp3[src] = new Audio( src );
					return mp3[src];
				} catch ( ex ) { }
			}
			return undefined;
		},
		play: function( src, volume ) {
			try {
				volume = volume || 1.0;
				var sound = SoundManager.getSound( src );
				if ( sound !== undefined ) {
					sound.volume = volume;
					sound.play();
				}
			} catch ( ex ) { }
		}
	};
	
})();