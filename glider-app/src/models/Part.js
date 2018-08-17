// Part JS Obj
export default class Part {
	constructor(props) {
		console.log("Made a naked JS Part Model");
		// This one can instantiate the Vue Components as required.
		this.vueComponent = props.vueComponent;
		this.sharedAttrs = props.sharedAttrs;
		this.views = [];
	}

	deactivate() {
		
	}
}

