/**
 * Class represents an App Instance. The whole "thing."
 */

// 8/31 Suggested next steps:
//  1) Massage FlightPlan.js
// 	- Reliably create Parts and PartViews to pass to App.js
//      - Reliably pass Place info to App.js
// 		- Pick a syntax convention and roll with it, then we can adapt!
// 		- * Considered to be Minimum Viable necessary -- hopefully we can tackle this first.

// 2) MVP PUSH (DO NOT WORK ON ANYTHING ELSE UNTIL THIS FUNCTIONALITY IS IN PLACE -- the rest will follow!)
// 	- With FlightPlan.js complete, use App.js to activate/deactivate parts based on phase and place (locally).
//  - When Place information is being passed reliably, this should be easy enough. As presently designed, the Place will activate its parts when told to do so.

// 3). Joel to connect App.js to $store to push active state remotely; refactor App.js as necessary
// 
// 4). Decouple places and part activation
// 5). Test and refactor, rinse and repeat!
		

import store from '@/store'

export default class App {

	/**
	* @constructor
	*/
	constructor() {
		this.rootPhase;

		this.activePhase;

		this.pppStore = [];
		this.places = [];
		this.parts = [];
	}

	run() {
		this.rootPhase.run();
	}

	/**
	 * This is called by the parser (FlightPlan) to associate a Phase object with a Part and a Place. 
	 * @param {object} pppCoordinate - The Part, Place, and Phase to associate
	 * @return void 
	 */
	setPPP(pppCoordinate) {
		let { part, place, phase } = pppCoordinate;
		this.pppStore.push(pppCoordinate);
		this.registerPart(part);
		this.registerPlace(place);

		this.places.push(place);

		console.log(`Associating Phase ${phase.id} with Part ${part.id} and Place ${place.id}`);
	}

	registerPart(part) {
		if(this.parts.indexOf(part) == -1)
			this.parts.push(part);
	}

	registerPlace(place) {
		if(this.places.indexOf(place) == -1)
			this.places.push(place);
	}

	/**
	* Called by Phases to announce which phase is active
	* @param phaseObject - the ref to the active Phase
	*
	*/
	phaseActive(phase) {
		this.activePhase = phase;
		this.triggerPhase(phase);
	}

	triggerPhase(phase) {
		// Update Remote Phase value with phase. Immediate plan is that Places will do the work.

		console.log(`phase ${phase.id} has been activated!`);

		let PP = this.getPartPlacesByPhase(phase);

	

		for(let i = 0; i < PP.length; i++) {
		 	console.log ("Tell Place " + PP[i].place.id + " to show " + PP[i].part.id);

		 	// don't do this. #ToDo. for testing purposes only. Let Places do it.
		 	//PP[i].part.activate();

		}

		//console.log('Matching PartPlaces:' + this.getPartPlacesByPhase(phase).map(pp => `${pp.part.id} goes on ${pp.place.id}`).join(', '));

		
	}

	getPhasePartsByPlace(place) {
    	return this.pppStore.filter(ppp => (ppp.place === place));
	}

	getPartPlacesByPhase(phase) {
    	return this.pppStore.filter(ppp => (ppp.phase === phase));
  	}

	/**
	* Called by Phases to announce a phase is inactive
	* @param phaseObject - the ref to the inactive Phase
	*
	*/
	phaseInactive(phase) {
		// let activeParts = this.getPartPlacesByPhase(phase);
		// for (let i = 0; i <= activeParts.length; i++) {
		// 	activeParts[i].part.deactivate();
		// }

		console.log(`${phase.id} has been deactivated!`);
	}

	/**
	* Get the ID of the currently-active Phase
	* @return {Number} the Phase ID
	*/
	getActivePhaseId() {
		return this.activePhase.id;
	}

	/**
	* Pretty much a private method; used before a repaint but isn't destructive.
	* Deactivates all the current parts in a Place layout
	* @param place the Place to search for active Parts
	*/
	killAllPlaceParts(place) {
		for (let i = 0; i <= place.activeParts.length; i++) {
			place.activeParts[i].deactivate();
		}
	}
}