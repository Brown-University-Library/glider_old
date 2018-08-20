<template>
	<div ref="flightplan" class="flightplan">

  <Part
    v-for="part in parts"
    v-bind:id="part.id"
    v-bind:ref="part.id"
  >
    
  </Part>

    <slot></slot>
	</div>
</template>

<script>
/* Importing Necessary Vue Components -- do not touch **/
import Part from '@/components/Part.vue'
import Place from '@/components/Place.vue'

/* Import other non-Vue modules */

import FlightPlan from '@/models/FlightPlan.js'


export default {
  name: 'FlightPlanTwo',
  props:['placeId'],
  components: {
    Part,
    Place
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
    
  }
}
</script>

