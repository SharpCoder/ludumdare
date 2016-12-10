// 2014-08-22
// SharpCoder
// This is the scene definition for my ludum dare 30 entry.

Scenes = (function() {

	return {
		Reset: function() {
			Framework.SetContext({
				Turn: 1,
				Message: "Your ship explodes during the battle, there are no survivors..",
				HP: 6,
				MAX_HEALTH: 6,
				Upgrades: {
					Weapons: 1,
					Crew: 1,
					Shields: 1,
					Level: 1
				},	
				Resources: {
					Land: 0,
					Food: 12,
					Metal: 0
				}
			});
		},
		Initialize: function() {

			// Setup the initial game context.
			// Context is a global data structure designed to keep track of top-level
			// game variables.
			Scenes.Reset();

			// Global scoping FTW! It's either that, or have
			// some hideously large file with everything merged in.
			// yuck!
			Framework.AddScene(new MainMenu());
			Framework.AddScene(new Level1());
			Framework.AddScene(new GameOver());
		}
	};

})();