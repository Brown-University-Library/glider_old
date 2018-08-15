<template>
	<div ref="flightplan" class="flightplan">
    <h1 style="display:none;">{{activePhase}}</h1>
		<PartsList ref="parts">
	    <Part ref="introSlide" id="introSlide" state="inactive" shared='{"bgColor":"red", "fontSize:":30}'>
        <PartView ref="introSlide.default" id="introSlide.default" state="inactive">

	       <h1>This is my intro "slide."</h1>
         <h2>This object name: {{this.name}}</h2>
         <p>Even more content! Wow!</p>
        </Partview>
        <PartView ref="introSlide.controller" id="introSlide.controller" state="inactive">
          <h1>I'm the controllyguy for IntroSlide</h1>
          <button v-on:click = "updateAttr('introSlide','bgColor', 'blue')">Do The Thing</button>
        </PartView>
	    </Part>

	    <Part ref="part2" id="part2" state="inactive" shared='{"bgColor":"green", "fontSize:":30}'>
	      <PartView ref="part2.default" id="part2.default" state="inactive">
          <h1>Hello! I'm another piece of content.</h1>
        </PartView>
    	</Part>
    </PartsList>

    <PlaceList ref="places">
    	<div class="places">
        <Place ref="DSLWall" id="DSLWall" type="grid" rows="3" columns="4">
          <KeyboardController></KeyboardController>
        </Place>

        <Place ref="Mobile" id="Mobile">
          
        </Place>
    	</div>
    </PlaceList>

    <PhaseList ref="phases">
      <Phase>
        <Display part="introSlide.default" place="DSLWall" region="r1c1w2h1"></Display>
        <Display part="introSlide.controller" place="Mobile"></Display>
      </Phase>

      <Phase>
        <Display part="part2.default" place="DSLWall" region="r3c1w1h1"></Display>
      </Phase>

      <Phase>
        <Display part="part2.default" place="Mobile"></Display>
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
import PartView from '@/components/PartView.vue'
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
    PartView,
    KeyboardController
  },

  data() {
    return {
      name:"FlightPlan",
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
    },

    updateAttr : function(ref, attr, val) {
      let that = this;
      let thing = {
        id: ref,
        attr: {
          name: attr,
          val: val
        }
      }

      this.$store.commit("updatePartAttr", thing);

    },

    setPPP: function() {

      // ready for repaint
      this.killAllParts();
      // grab the active phase per this.activePhase
      this.activePhaseComponent = this.phases[this.activePhase];

      // get each active <Display> in the current phase
      this.activeDisplays = this.activePhaseComponent.$children; 
      // just testing, using the 0th Display to test
      let displays = this.activeDisplays;
      
      for(let display in displays) {
        // change Part's state to active and parse its region if applicable
        let curdis = displays[display];


        if(curdis.place == this.activePlace.id.toLowerCase() || curdis.place == this.activePlace.id) {
          let distarget = curdis.part;
          let parent = curdis.part.split(".")[0];

          
          this.$refs[parent].activate(distarget);

          if (curdis.region !== undefined) {
            console.log(curdis.region + " is the active region (if applicable)");
            this.$refs[curdis.part.split(".")[0]].putInRegion(curdis.region);
          }
        }
      }
    }
  },

  updated() {
    this.setPPP();
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

    this.setPPP();


    // just go ahead and give the main layout the class that can match the place id? CSS to match?
    document.querySelector('.partsList').classList.add(this.activePlace.id);

  }
}
</script>

