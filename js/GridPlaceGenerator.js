class GridPlaceGenerator {
	constructor(props) {

		this.rows = props.rows;
		this.cols = props.cols;

		this.generatedPlaces = [];

		this.wrapper = props.wrapper;

		this.parent = this.generateParentDOMNode(props.parentClass);

	}

	generatePlaces() {
		// create permutations of rows, cols, and spans. probably should use map. sue me.
		
		for (var row = 1; row <= this.rows; row++) {
			for (var col = 1; col <= this.cols; col++) {
				// which starting row, which starting column, how many rows to span, how many cols to span
				for (var spanRow = 1; spanRow <= this.rows; spanRow++) {
					for (var spanCol = 1; spanCol <= this.cols; spanCol++) {
						let props = {
							row: row,
							col: col,
							spanRows: spanRow,
							spanCols : spanCol
						}

						let id = "r" + row + "c" + col + "h" + spanRow + "w" + spanCol;

						let place = new GridPlace(id, props);

						this.generatedPlaces.push(place);
					}
				}
			}
		}
	}

	generateParentDOMNode(parentClass) {
		let parentDOMNode = document.createElement('div');
			parentDOMNode.classList.add(parentClass);

		console.log(this.wrapper);

		document.querySelector(this.wrapper).appendChild(parentDOMNode);
	}

	getGeneratedPlaces() {
		return this.generatedPlaces;
	}
}