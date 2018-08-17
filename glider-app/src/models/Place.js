
/**
 * Class represents a Place Instance. 
 * These are accessed via routing in Vue but also need their own Vue-agnostic functionality.
 */

export default class Place {
	/**
	* @constructor
	*/
	constructor(id, props) {
		/*
		*
		* When App.currentPhase equals a phase in this object, light 'em up!
		*
		*/
		this.PP = window.Glider.getPhasePartsByPlace(this);
		this.activeParts = [];

	}
	
	// or, "paint()." Activate the part(s) that are supposed to be displayed. 
	// Triggered when phase is changed
	activate() {
		// set this.activeParts equal to the Parts pertinent to App.activePhase
		// in other words, filter this.PP by current phase.
		// activate each part, locally (not remotely) -- this is because places are routable.
	}

	deactivate() {
		this.killAllParts();
	}

	setupLayout () {

	}

	killAllParts(){
		this.PP.forEach(function (part) {
			part.updateState("inactive");
		});
    }
}


export default class GridPlace extends Place {

  constructor(id, props){
    super(id, props);

    //category, row, column, spanrows, spancols

    this.row = props.row;
    this.column = props.col;
    this.spanRows = props.spanRows;
    this.spanCols = props.spanCols;
    

  }

  // this may be moot -- latest model is to have Place represent the route 
  // and the Part to be wrapped in the Place CSS when displayed (including region)
  // ...and most of it is handled by CSS

  constructCSS() {
    // from row, column, spanrows, spancols, etc;
    
    this.domWrapper.style.gridRow = this.row + " / span " + this.spanRows;
    this.domWrapper.style.gridColumn = this.column + " / span " + this.spanCols;
    
  }
}
