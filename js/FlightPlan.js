class FlightPlan {
  constructor() {
    this.placesPath = "places.xml";
    this.partsPath = "parts.xml";
    this.phases;
    this.buildPhases();
  }

  ingestPlaces() {

  }

  ingestParts() {
  	// build parts from the path identified in the 
  }

  buildPhases() {
  	var phases = document.querySelectorAll("phase");
  }
}