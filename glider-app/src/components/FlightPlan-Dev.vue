<template>
	<div ref="flightplan" class="flightplan">
  <Part
    v-for="part in parts"
    v-bind:id="part.id"
    v-bind:ref="part.id"
  >
    
    <PartView
    v-for ="pv in part.views">

    </PartView>

  </Part>

  <Place
    v-for="place in places"
    v-bind:id="place.id"
    v-bind:ref="place.id"
  ></Place>
    <slot></slot>
	</div>
</template>

<script>
/* Importing Necessary Vue Components -- do not touch **/
import Part from '@/components/Part.vue'
import PartView from '@/components/PartView.vue'
import Place from '@/components/Place.vue'

/* Import other non-Vue modules */

import FlightPlan from '@/models/FlightPlan.js'
import Phase from '@/models/Phase.js'

export default {
  name: 'FlightPlanTwo',
  props:['placeId'],
  components: {
    Part,
    Place,
    PartView,
  },

  data() {
    return {
      parts:[],
      places:[]
    }
  },

  mounted () {

    this.parts = window.glider.parts;
    this.places = window.glider.places;
 

    // get all Places from pppStore
    //this.places = window.glider.allPlaces;
  }
}
</script>

