import PartView from "@/models/PartView.js"

// Part JS Obj
export default class Part {
	constructor(props) {
		this.sharedAttrs = props.options;
		this.container = props.container;
		this.views = [];
		this.state = "inactive";
		this.HTMLContent = props.container.outerHTML;
		this.styleObj = {};
		
		this.registerPartViews();

	}

	// This will be two-way bound by the Part's Vue Component Representation

	deactivate() {
		//this.container.classList.add("hidden");
		this.state = "inactive";
	}

	// Again, two-way bound by the Vue Component

	activate(partView) {
		//this.container.classList.remove("hidden");
		
		partView.state = "active";
		this.state = "active";
	}

	applyStyle(obj) {
		this.styleOjb = obj;
	}

	// #ToDo Refactor to use Store when this is working locally.

	updateSharedOption(attr, val) {
		this.sharedAttrs[attr] = val;
		console.log(`Updated ${attr} to ${val}!`);
	}

	// Instatiate all the PartViews
	// #ToDo if there aren't any PartViews defined, do something about a "default"

	registerPartViews() {
		// for each partview (from flightPlan?), register a new PartView
		// #ToDo create a way to assume a default view
		let v = this.container.querySelectorAll(".part-view");
		let that = this;
		for (let i = 0; i < v.length; i++) {
			this.views.push(new PartView(that, v[i]));
		}
	}

}

