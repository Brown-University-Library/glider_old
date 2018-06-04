class FlightPlan {
  
  constructor(places) {
    console.log("constructing flight plan...");
    this.phaseList;
    this.currentPhaseIndex = 0;
    this.currentPhase;
    this.places = places;
    this.activeDisplayPairs = [];

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
    let that = this; 
    document.onkeydown = function(e) {

        e = e || window.event;
        if (e.keyCode == '39') {
           that.nextPhase();
        }
        else if (e.keyCode == '37') {
           that.prevPhase();
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

  getPlaceByString (str) {
    var place = this.places.find(function (place) { return place.id == str; });
    return place;
  }

  triggerCurrentPhase(){
    this.activeDisplayPairs = [];
    //console.log("my phaseIndex is" . this.currentPhaseIndex);
    this.currentPhase = this.phaseList[this.currentPhaseIndex];

    console.log("...starting phase # " + this.currentPhaseIndex);

    let displayList = this.currentPhase.querySelectorAll("display");
    //console.log(displayList);

    for (var i=0; i< displayList.length; i++) {
      var display = displayList[i];
      var part = display.getAttribute("part");
      var targetPlace = display.getAttribute("place");
      var placeObj = this.getPlaceByString(targetPlace);

      this.activeDisplayPairs.push({place:targetPlace, part:part});
      
      // #TODO jsonify activeDisplayPairs and push to firebase

      

      // here, there'll be a message sent to the broker/bus to 
      // update global current phase (as in this object)
      // first thought here is that anything acting as a view is simply
      // watching current phase and hitting an endpoint /place/phase pair to get content 

      // if(placeObj != undefined)
      //  placeObj.setContent("Here, have part #"+part);
      // //console.log("display part # " + part + " on place # " + targetPlace);

      this.updateAllPlaces();
    }
  }

  updateAllPlaces() {
   for (var i = 0; i < this.places.length; i++) {
    this.updatePlace(this.places[i].id);
   }
  }

  updatePlace(placeID) {
    let content = this.getContentByPlaceForCurrentPhase(placeID);
    var placeObj = this.getPlaceByString(placeID);


    placeObj.setContent(content);
  }

  getContentByPlaceForCurrentPhase(placeID) {
    //var placeObj = this.getPlaceByString(placeID);

    var display = this.activeDisplayPairs.find(function (display) { return display.place == placeID; });
    console.log(display);

    if (display !== undefined)
      return "Here, have part # " +display.part;
    else
      return "";
  }
}