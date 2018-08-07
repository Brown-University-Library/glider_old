
/**
 * Class represents an Place Instance. These are accessed via routing in Vue but also need their own stuff.
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
		let PP = window.Glider.phasePartsByPlace(this);
	}
	
	activate() {

	}

	deactivate() {

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

  constructCSS() {
    // from row, column, spanrows, spancols, etc;
    
    this.domWrapper.style.gridRow = this.row + " / span " + this.spanRows;
    this.domWrapper.style.gridColumn = this.column + " / span " + this.spanCols;
    
  }
}