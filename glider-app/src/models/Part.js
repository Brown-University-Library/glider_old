import PartView from "@/models/PartView.js"

// Part JS Obj
export default class Part {
	constructor(props) {
		this.sharedAttrs = props.options;
		this.container = props.container;
		this.views = [];
		this.state = "inactive";
		this.HTMLContent = props.container.outerHTML;
		
		//this.registerPartViews(props.views);

	}

	deactivate() {
		this.container.classList.add("hidden");
		this.state = "inactive";
	}

	activate() {
		this.container.classList.remove("hidden");
		this.state = "active";
	}

	updateSharedOption(attr, val) {
		this.sharedAttrs[attr] = val;
		console.log(`Updated ${attr} to ${val}!`);
	}

	registerPartViews(v) {
		// for each partview (from flightPlan?), register a new PartView
		let that = this;
		for (let i = 0; i < v.length; i++) {
			this.views.push(new PartView(that, v[i]));
		}
	}

}

