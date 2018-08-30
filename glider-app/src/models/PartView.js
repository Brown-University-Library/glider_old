export default class PartView {
	constructor(parent, props) {
		this.options = this.props.options;
		this.parent = parent;
		this.element = props.domElement;
		this.state = props.state || "inactive";
	}

	activate() {
		this.state = active;
	}

	deactivate() {
		this.state = "inactive";
	}

}
