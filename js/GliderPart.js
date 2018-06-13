class GliderPart {
	constructor(id, props) {

		this.id = id;
		this.domElement = document.getElementById(id);
		this.defaultViewElement = this.domElement.querySelector('.view-default');

	}

	getDefaultView() {
		return this.defaultViewElement.innerHTML;
	}
}