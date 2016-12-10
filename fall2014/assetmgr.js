// 2014-08-22
// SharpCoder
// This is the asset manager for my ludum dare 30 entry.
Assets = (function() {

	var images = [
		'viking.png', 
		'longboat.png', 
		'speaker.png',
		'speaker_off.png',
		'space.png', 
		'planet.png', 
		'redplanet.png', 
		'missile.png',
		'game_menu.png',
		'heart.png',
		'heart_ruined.png',
		'heart_gone.png',
		'action_fix.png',
		'action_fix_disabled.png',
		'explosion_1.png',
		'explosion_2.png',
		'explosion_3.png',
		'explosion_4.png',
		'explosion_5.png',
		'railgun.png',
		'upgrade_menu.png',
		'upgrade_tier.png',
		'upgrade_tier_disabled.png',
		'upgrade_shield.png',
		'upgrade_shield_disabled.png',
		'upgrade_crew.png',
		'upgrade_crew_disabled.png',
		'upgrade_weapon.png',
		'upgrade_weapon_disabled.png',
		'action_siege.png',
		'action_siege_disabled.png',
		'action_upgrade.png',
		'action_upgrade_disabled.png',
		'action_engineer.png',
		'action_fight.png',
		'action_farm.png',
		'action_sacrifice.png',
		'action_engineer_disabled.png',
		'action_fight_disabled.png',
		'action_farm_disabled.png',
		'action_sacrifice_disabled.png',
		'game_over.png',
		'game_win.png',
		'bubbleviking_upgrade.png',
		'bubbleviking.png'];

	var sounds = [
		'tavern.wav',
		'tavern.mp3',
		'heal.wav',
		'heal.mp3',
		'pew.wav',
		'pew.mp3',
		'explosion.mp3',
		'explosion.wav',
		'lazer.wav',
		'lazer.mp3',
		'shields_low.wav',
		'shields_low.mp3',
		'resources_low.wav',
		'resources_low.mp3',
		'starving_to_death.wav',
		'starving_to_death.mp3',
		'food_low.wav',
		'food_low.mp3',
		'upgrade.wav',
		'upgrade.mp3',
		'generic.wav',
		'generic.mp3',
		'begin.wav',
		'begin.mp3',
		'happy.wav',
		'happy.mp3',
		'chickens.wav',
		'chickens.mp3',
		'death_theme.wav',
		'death_theme.mp3'
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
		}
	};

})();