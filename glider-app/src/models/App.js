/**
 * Class represents an App Instance. The whole "thing."
 */

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
		//let ppMatchups = this.partPlacesByPhase(phase);
		console.log(`${phase.id} has been activated!`);

		let PP = this.getPartPlacesByPhase(phase);

		//console.log(PP);

		for(let i = 0; i < PP.length; i++) {
		 	console.log ("Put " + PP[i].part.id + " on " + PP[i].place.id);
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