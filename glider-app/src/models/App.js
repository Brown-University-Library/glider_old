
/**
 * Class represents an App Instance. The whole "thing."
 */

export default class App {

	/**
	* @constructor
	*/
	constructor() {
		// here we goooo
		this.startTime =  new Date();
		this.rootPhase;
		this.activePhase;

		this.pppStore = [];
	}

	run() {
		
	}

	getPartById(id) {
		
	}

	/**
	 * This is called by the parser (FlightPlan) to associate a Phase object with a Part and a Place. 
	 * @param {object} pppCoordinate - The Part, Place, and Phase to associate
	 * @return void 
	 */
	setPPP(pppCoordinate) {
		this.pppStore.push(pppCoordinate);
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

		// Update Remote Phase value with phase. Places will do the work.
		let ppMatchups = this.partPlacesByPhase(phase);

	}

	get phasePartsByPlace(place) {
    	return this.pppStore.filter(ppp => (ppp.place === place));
	}

	get partPlacesByPhase(phase) {
    	return this.pppStore.filter(ppp => (ppp.phase === phase));
  	}

	/**
	* Called by Phases to announce a phase is inactive
	* @param phaseObject - the ref to the inactive Phase
	*
	*/
	phaseInactive(phaseObject) {

	}

	/**
	* Get the ID of the currently-active Phase
	* @reutrn {Number} the Phase ID
	*/
	getActivePhaseId() {
		return this.activePhase;
	}

	/**
	* Pretty much a private method; used before a repaint but isn't destructive.
	* Deactivates all the current parts in a Place layout
	* @param placethe Place to search for active Parts
	*/
	killAllPlaceParts(place) {
		for (let i = 0; i <= place.activeParts.length; i++) {
			place.activeParts[i].deactivate();
		}
	}
}