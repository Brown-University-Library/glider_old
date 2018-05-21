class FlightPlan {
  
  constructor() {
    console.log("constructing flight plan...");
    this.phaseList;
    this.currentPhaseIndex = 0;
    this.currentPhase;
    this.buildPhases();
    this.triggerCurrentPhase();
    this.setupKeyPressListeners();
  }

  buildPhases() {
    console.log("building phases...");
    // using xml syntax right now for ease, #todo convert to preferred markup
  	this.phaseList = document.querySelectorAll("phase");
  }

  setupKeyPressListeners () {
    // saving "this" for later in anonymous func
    var ctx = this; 
    document.onkeydown = function(e) {

        e = e || window.event;
        if (e.keyCode == '39') {
           ctx.nextPhase();
        }
        else if (e.keyCode == '37') {
           ctx.prevPhase();
        }
    }
  }

  prevPhase() {
    if (this.currentPhaseIndex !== 0)
      this.currentPhaseIndex--;
    this.triggerCurrentPhase();
  }

  nextPhase() {
    if (this.currentPhaseIndex != this.phaseList.length-1)
      this.currentPhaseIndex++;
    this.triggerCurrentPhase();
  }

  triggerCurrentPhase(){
    //console.log("my phaseIndex is" . this.currentPhaseIndex);
    this.currentPhase = this.phaseList[this.currentPhaseIndex];

    console.log("...starting phase # " + this.currentPhaseIndex);

    let displayList = this.currentPhase.querySelectorAll("display");
    //console.log(displayList);

    for (var i=0; i< displayList.length; i++) {
      var display = displayList[i];
      var part = display.getAttribute("part");
      var place = display.getAttribute("place");

      // here, there'll be a message sent to the broker/bus to 
      // update global current phase (as in this object)
      // first thought here is that anything acting as a view is simply
      // watching current phase and hitting an endpoint /place/phase pair to get content 


      console.log("display part # " + part + " on place # " + place);

    }
  }
}