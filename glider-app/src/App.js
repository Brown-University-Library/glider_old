
/**
 * Class represents an App Instance. The whole "thing.""
 */

export default class App {

	/**
	* @constructor
	*/
	constructor() {
		// here we goooo
		this.startTime =  new Date();
		this.rootPhase;
		this.pppStore = [];
	}

	run() {
		
	}

	getPartById(id) {
		
	}

	/**
	 * This is called by the parser (FlightPlan) to associate a Phase object with a Part and a Place. 
	 * In Vue, triggered on Flight Plan's mounted() and update().
	 * @param {object} pppCoordinate - The Part, Place, and Phase to associate
	 * @return void 
	 */
	setPPP(pppCoordinate) {
		//Phase object with a Part and a Place
		this.killAllParts();
	}

	/**
	* Called by Phases to announce which phase is active
	* @param phaseObject - the ref to the active Phase
	*
	*/
	phaseActive(phaseObject) {

		this.activePhase = phaseObject;

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
		return this.activePhase.id;
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