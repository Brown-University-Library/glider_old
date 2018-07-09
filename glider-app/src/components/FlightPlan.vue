<template>
	<div ref="flightplan" class="flightplan">
    <h1>Active Phase: {{activePhase}}</h1>
		<PartsList ref="parts">
	    <Part ref="part1" id="part1" state="inactive">
	      <h1>Hello! I'm Part1</h1>
	    </Part>

	    <Part ref="part2" id="part2" state="inactive">
	      <h1>Party Party Part2</h1>
        <h2>Weee!</h2>
    	</Part>

    	<Part type="ImageZoom" id="imagezoom1" zoomLevel="1" state="inactive" asset="http://placekitten.com/400/400"></Part>
    </PartsList>

    <PlaceList ref="places">
    	<div class="places">
        <Place ref="DSLWall" id="DSLWall" type="grid" rows="3" columns="4">
          <KeyboardController></KeyboardController>
        </Place>

        <Place ref="Mobile" id="Mobile">
          <KeyboardController></KeyboardController>
        </Place>
    	</div>
    </PlaceList>

    <PhaseList ref="phases">
      <Phase>
        <Display part="part1" place="DSLWall"></Display>
        <Display part="part2" place="mobile"></Display>
      </Phase>

      <Phase>
        <Display part="part2" place="DSLWall"></Display>
      </Phase>
    </PhaseList>   

	</div>
</template>

<script>

import PartsList from '@/components/PartsList.vue'
import PhaseList from '@/components/PhaseList.vue'
import DisplayList from '@/components/DisplayList.vue'
import PlaceList from '@/components/PlaceList.vue'
import Part from '@/components/Part.vue'
import Place from '@/components/Place.vue'
import Phase from '@/components/Phase.vue'
import Display from '@/components/Display.vue'
import KeyboardController from '@/components/KeyboardController.vue'



export default {
  name: 'FlightPlan',
  props:['placeId'],
  components: {
    Part,
    Place,
    Phase,
    Display,
    PartsList,
    PhaseList,
    DisplayList,
    PlaceList,
    KeyboardController
  },

  data() {
    return {
      allParts: []
    }
  },

  computed:{
    activePhase: function(){
      return this.$store.getters.getCurrentPhase
    },
  }, 

  methods: {
    killAllParts: function(){
      this.allParts.forEach(function (part) {
        part.updateState("inactive");
      });
    }
  },

  updated() {
    console.log("updated!");
    this.killAllParts();
    // grab the active phase per this.activePhase
    this.activePhaseComponent = this.phases[this.activePhase];

    // get each active <Display> in the current phase
    this.activeDisplays = this.activePhaseComponent.$children; 
    // just testing, using the 0th Display to test
    let displays = this.activeDisplays;
    
    for(let display in displays) {
      // change Part's state to active
      if(displays[display].place == this.activePlace.id.toLowerCase() || displays[display].place == this.activePlace.id)
        this.$refs[displays[display].part].updateState("active");
    }


    // just go ahead and give the main layout the class that can match the place id? CSS to match?
    this.$refs.flightplan.classList.add(this.activePlace.id);
  },

  mounted() {

    let that = this;

    this.allParts = this.$refs['parts'].$children;

    // should do this first
    this.activePlace = this.$refs[that.placeId];
    this.activePlace.state = "active";

    // grab all <Phase> components
    this.phases = this.$refs.phases.$children;
    // grab the active phase per this.activePhase
    this.activePhaseComponent = this.phases[this.activePhase];

    // get each active <Display> in the current phase
    this.activeDisplays = this.activePhaseComponent.$children; 
    
    // just testing, using the 0th Display to test
    let displays = this.activeDisplays;
    
    for(let display in displays) {
      // change Part's state to active
      if(displays[display].place == this.activePlace.id.toLowerCase() || displays[display].place == this.activePlace.id)
        this.$refs[displays[display].part].updateState("active");
    }


    // just go ahead and give the main layout the class that can match the place id? CSS to match?
    this.$refs.flightplan.classList.add(this.activePlace.id);


  const FBConfig = {
      apiKey: "AIzaSyDiG79nyWATW1tcjLsD2YY2Zr5z8qW7ZyU",
      authDomain: "glider-flightplan-example.firebaseapp.com",
      databaseURL: "https://glider-flightplan-example.firebaseio.com",
      projectId: "glider-flightplan-example",
      storageBucket: "glider-flightplan-example.appspot.com",
      messagingSenderId: "201089278480"
    }
    firebase.initializeApp(FBConfig);

  const remotePhase = firebase.database().ref().child('phase');
  remotePhase.on('value', function(snapshot) {
        let myphase = snapshot.val();
        that.$store.commit("phaseActive", myphase);
  });




  }

}
</script>

