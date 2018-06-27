<template>
	<div class="flightplan">
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
        <Place ref="DSLWall" id="DSLWall" type="grid"></Place>
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
    PlaceList
  },

  data() {
    return {
      activePhase:0
    }
  },

  mounted() {
    let that = this;
    this.phases = this.$refs.phases.$children;
    this.activePhaseComponent = this.phases[this.activePhase];
    this.activeDisplays = this.activePhaseComponent.$children; 
    let display = this.activeDisplays[0];
    console.log("Display " + display.part + " on " + display.place);
    this.$refs[display.part].updateState("active");

    this.activePlace = this.$refs[that.placeId];

    this.activePlace.state = "active";

  }
}
</script>

