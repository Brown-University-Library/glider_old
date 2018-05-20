class FlightPlan {
  
  constructor() {
    console.log("constructing flight plan...");
    this.phaseList;
    this.currentPhaseIndex = 0;
    this.currentPhase;
    this.buildPhases();
    this.renderCurrentPhase();
    this.setupKeyPressListeners();
  }

  buildPhases() {
    console.log("building phases...");
  	this.phaseList = document.querySelectorAll("phase");
  }

  setupKeyPressListeners () {
    var hoist = this; // not really but
    document.onkeydown = function(e) {

        e = e || window.event;
        if (e.keyCode == '37') {
           hoist.nextPhase();
        }
        else if (e.keyCode == '39') {
           hoist.prevPhase();
        }
    }
  }

  nextPhase() {
    this.currentPhaseIndex--;
    this.renderCurrentPhase();
  }

  prevPhase() {
    this.currentPhaseIndex++;
    this.renderCurrentPhase();
  }

  renderCurrentPhase(){
    //console.log("my phaseIndex is" . this.currentPhaseIndex);
    this.currentPhase = this.phaseList[this.currentPhaseIndex];

    console.log("...starting phase # " + this.currentPhaseIndex);

    let displayList = this.currentPhase.querySelectorAll("display");
    //console.log(displayList);

    for (var i=0; i< displayList.length; i++) {
      var display = displayList[i];
      var part = display.getAttribute("part");
      var place = display.getAttribute("place");
      //console.log(display.getAttribute("part"));
      console.log("display part # " + part + " on place # " + place);
    }
  }
}