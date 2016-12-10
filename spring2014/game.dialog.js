// game.dialog.js
// The game dialog definitions.
// Created by SharpCoder
// 2014-04-26

DialogOption = function( config ) {
	this.text = config.text || '';
	this.response = config.response || '';
	this.cost = config.cost || 0;
	this.award = config.award || 0;
}

DialogNode = function(config) {
	
	this.title = config.title || '';
	this.description = config.description || '';
	this.options = config.options || [];
	
};

DialogNode.prototype.addOption = function( node ) {
	this.options[this.options.length] = node;
}

DialogEngine = (function() {

	// Setup the dialog here.
	var graph = new Array();
	
	return {
		graph: graph,
		addDialog: function( dialog ) {
			this.graph.push( dialog );
		},
		getRandomDialog: function() {
			var index = Math.round( Math.random() * (graph.length - 1) );
			return graph[index];
		}
	};

})();

(function() {
	
	// Initialize the dialogs.
	
	// DIALOG 1
	// ***************************************
	var dialog = new DialogNode({
		title: 'This planet is inhabited!',
		description: 'It appears there is a Class 3 civilization currently populating this planet. Continuing with the mission would undoubtedly result in the death of this primitive tribe of people.'
	});
	var option1 = new DialogOption({
		text: 'Proceed Anyway', cost: 0, response: 'It\'s just a primitive tribe anyway...'
	});
	var option2 = new DialogOption({ 
		text: 'Beam up the inhabitants [100 credits]', response: 'A just decision, though a bit costly...', cost: 100
	});
	
	dialog.addOption( option1 );
	dialog.addOption( option2 );	
	DialogEngine.addDialog( dialog );
	
	// DIALOG 2
	// ***************************************
	dialog = new DialogNode({
		title: 'Your scans have picked up a cache of goods.',
		description: 'It appears there is a cache of equipment left on this deserted planet.'
	});
	
	option1 = new DialogOption({
		text: 'Investigate',
		response: 'You have found 100 credits!',
		award: 100
	});
	
	option2 = new DialogOption({
		text: 'Ignore',
		response: 'That could have been risky.'
	});
	
	dialog.addOption( option1 );
	dialog.addOption( option2 );
	DialogEngine.addDialog( dialog );
	
	DialogEngine.addDialog( new DialogNode({
		title: 'Love at first sight...',
		description: 'It appears one of the inhabitants of this planet is in love with you! Continuing the mission would surely mean their demise.',
		options: [
			new DialogOption({
				text: 'Save your Lover [50 credits]',
				response: 'May you live long and prosper.',
				cost: 50
			}),
			new DialogOption({
				text: 'Light it up!',
				response: 'Who needs love anyway?'
			}),
			new DialogOption({
				text: 'Blackmail your lover for more money',
				response: 'Extra cash is always a good thing, I guess. Who needs love anyway?',
				award: 150
			})
		]
	}));
	
	DialogEngine.addDialog( new DialogNode({
		title: 'Comm Unit is Down',
		description: 'Oh no, the space dolphins of this planet are rallying. Perhaps you could try to communicate with them?',
		options: [
			new DialogOption({
				text: 'Reach out to the dolphins',
				response: 'The dolphins swarm your shuttle craft and severely damaged it. You barely escape with your life.',
				cost: 120
			}),
			new DialogOption({
				text: 'Relay their distress signals',
				response: 'Hopefully no one arrives before you finish the job!'
			}),
			new DialogOption({
				text: 'Continue the operation',
				response: 'May their memory be forever imprinted throughout space and time...'
			})
		]
	}));
	
	DialogEngine.addDialog( new DialogNode({
		title: 'Hostile Actions Detected',
		description: 'It seems your mission has not gone unnoticed. The people of this world are fighting back.',
		options: [
			new DialogOption({
				text: 'Rain down fire from above',
				response: 'Hostilities are not very cordial. It is time to show these people the meaning of life.'
			}),
			new DialogOption({
				text: 'Work out an arrangement',
				response: 'Unfortunately, it appears that negotiations have failed. Time for plan B...',
			}),
			new DialogOption({
				text: 'Play God',
				response: 'After declaring your impressive hand, the people have decided to sacrifice themselves to you. Well, better get on with the mission...',
				award: 250
			})
		]
	}));
	
	DialogEngine.addDialog( new DialogNode({
		title: 'Scans have picked up something...',
		description: 'This planet is harboring a revolutionary new medicine that could save trillions of people throughout the galaxy.',
		options: [
			new DialogOption({
				text: 'Steal the technology',
				response: 'You beam down to the surface and smuggle the technology out. Afterwards, you take all the credit and receive high praise.',
				award: 300
			}),
			new DialogOption({
				text: 'Blow up the planet anyway',
				response: 'Medicine is for those who are sick.',
			}),
			new DialogOption({
				text: 'Keep it for yourself',
				response: 'No sense in furthering humanitarian goals. You decide to keep the medicine for yourself, should something happen.'
			})
		]
	}));
	
	DialogEngine.addDialog( new DialogNode({
		title: 'Scans have picked up something...',
		description: 'A developing species of intelligent fox has been found on this planet. They are trying to communicate with you.',
		options: [
			new DialogOption({
				text: 'Kidnap a fox',
				response: 'You beam down to the surface and kidnap one of the foxes. It will fetch a nice price on the black market.',
				award: 500
			}),
			new DialogOption({
				text: 'Blow up the planet anyway',
				response: 'Talking foxes? How freaky is that... Target acquired!',
			}),
			new DialogOption({
				text: 'Talk to them',
				response: 'After a long discussion, it seems the fox have solved lifes many mysteries... Well, time to get down to business!'
			})
		]
	}));
	
})();