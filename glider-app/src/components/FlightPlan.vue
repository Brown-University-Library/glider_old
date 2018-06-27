<template>
	<div ref="flightplan" class="flightplan">
		<PartsList ref="parts">
	    <Part ref="part1" id="part1" state="inactive">
	      <h1>Hello! I'm Part1</h1>
	    </Part>

	    <Part ref="part2" id="part2" state="inactive">
	      <h1>Party Party Part2</h1>
    	</Part>

    	<Part type="ImageZoom" id="imagezoom1" zoomLevel="1" state="inactive" asset="http://placekitten.com/400/400"></Part>
    </PartsList>

    <PlaceList ref="places">
    	<div class="places">
        <Place ref="DSLWall" id="DSLWall" type="grid">
          <KeyboardController></KeyboardController>
        </Place>
    	</div>
    </PlaceList>

    <PhaseList ref="phases">
      <Phase>
        <Display part="part1" place="DSLWall"></Display>
      </Phase>

      <Phase>
        <Display part="part2" place="place1"></Display>
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
      activePhase:0
    }
  },

  mounted() {
    let that = this;

    // should do this first
    this.activePlace = this.$refs[that.placeId];
    this.activePlace.state = "active";

    // grab all <Phase> components
    this.phases = this.$refs.phases.$children;

    // grab the active phase per this.activePhase
    this.activePhaseComponent = this.phases[this.activePhase];

    // get each active <Display> in the current phase
    this.activeDisplays = this.activePhaseComponent.$children; 


    // just testing, using the 0th display to test
    let display = this.activeDisplays[0];
    console.log("Display " + display.part + " on " + display.place);

    // change Part's state to active
    this.$refs[display.part].updateState("active");


    // just go ahead and give the main layout the class that can match the place id? CSS to match?
    this.$refs.flightplan.classList.add(this.activePlace.id);

  }
}
</script>

