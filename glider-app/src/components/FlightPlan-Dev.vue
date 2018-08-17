<template>
	<div ref="flightplan" class="flightplan">

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
      phases:[],
      places:[]
    }
  },

  mounted () {

  }
}
</script>

