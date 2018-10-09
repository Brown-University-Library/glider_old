<template>
  <div :class="[placeId, 'glider-root']">

   <Phase duration="2s">
   		<Put on="DSLWall.r1c1w1h1">
   			<!-- Here we're defining a part (i.e., "some content") 
   				and using it at the 
   				same time, showing it on 
   				DSLWall.r1c1w1h1. -->
   			<Part id="part1">
   				<h1>Blahdeeblah I'm Part1</h1>
   			</Part>
   		</Put>
   </Phase>

   <Phase duration="3s">
   		<!-- Here we're referencing @part1 and moving it to DSLWall.r1c3w1h1" -->
   		<Put on="DSLWall.r1c3w1h1" part="@part1"></Put>

   		<!-- We're also showing it at the endpoint "mobile." -->
   		<Put on="mobile" part="@part1"></Put>
   </Phase>




  </div>
</template>

<script>
// @ is an alias to /src
import Part from '@/components/Part.vue'
import Phase from '@/components/Phase.vue'
import Put from '@/components/Put.vue'

export default {
  name: 'home',
  props:['placeId'],
  components: {
  	Part,
  	Phase,
  	Put
  }
}
</script>
