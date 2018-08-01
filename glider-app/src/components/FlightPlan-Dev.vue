<template>
	<div ref="flightplan" class="flightplan">
  
    <Part
      v-for="part in parts"
      v-bind:key="part.id"
      v-bind:part="part"
    ></Part>

    <Place
      v-for="place in phases"
      v-bind:key="place.id"
      v-bind:place="place"
    ></Place>

    <Phase
      v-for="phase in phases"
      v-bind:key="phase.id"
      v-bind:phase="phase"
    ></Phase>


	</div>
</template>

<script>
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
      name:"FlightPlan!",
      allParts: []
    }
  },

  computed:{

  }, 

  methods: {

    },

    updateAttr : function(ref, attr, val) {


    },

    setPPP: function() {

      
  },

  updated() {

  },

  mounted() {


  }
}
</script>

