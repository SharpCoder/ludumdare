// game.graph.js
// The game "map" or "graph" file.
// Created by SharpCoder
// 2014-04-26

PlanetNode = function( config ) {
	
	config = config || {};
	
	this.name = generateGreekName();
	this.parent = config.parent;
	this.worth = config.worth || Math.round( Math.random() * 1000 );
	this.asteroids = config.asteroids || (( Math.random() * 10) > 7); // 30% chance
	this.children = config.children || [];
};

PlanetMap = (function() {
	
	// Generate a random topology.
	var topology = [1];
	var root = [];
	var maxBreadth = 0;
	var change= true;
	
	for ( var i = 1; i < ( 4 + Math.random() * 3 ); i++ ) {
		topology[i] = 2 + Math.round(Math.random() * 2);
		if ( topology[i] > maxBreadth )
			maxBreadth = topology[i];
		if ( topology[i] > 4 ) topology[i] = 4;
		if ( topology[i] == 4 ) change = false;
	}
	
	// Make sure one topology or more is 4 (so the map looks good).
	if ( change ) {
		var index = Math.round( 1 + Math.random() * (topology.length - 2) );
		topology[index] = 4;
		maxBreadth = 4;
	}
	
	for ( var i = 0; i < topology[0]; i++ ) {
		root[i] = new PlanetNode({ });
	}
	
	function gen( parents, depth ) {
		
		if ( depth > topology.length ) return;
		var layer = [];
		for ( var i = 0; i < topology[depth]; i++ ) {
			layer[i] = new PlanetNode({
				parent: parents
			});
		}
		
		for ( var i = 0; i < parents.length; i++ ) {
			parents[i].children = layer;
		}
		
		gen( layer, depth + 1 );
	}
	
	gen( root, 1 );
	
	
	return {
		root: root,
		maxBreadth: maxBreadth,
		topology: topology
	};
	
	
})();
