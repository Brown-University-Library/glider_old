<template>
  <div :ref="placeId" :class="['glider-root', placeId]">
			<div id = "placeDefinitions">
				<Place id="DXLabWall" type="grid" cols="2" rows="4"></Place>
				<Place id="mobile"></Place>
			</div>

			<Phase id="phase1" duration="5000">
				<Put on="DXLabWall/r1c1h1w1">
					<!-- Here we're defining a part (i.e., "some content") 
						and using it at the 
						same time, showing it on 
						DSLWall -->
					<Part ref="part1" id="part1">
						<h1>Blahdeeblah I'm Part1</h1>
						<p>And some content and stuff.</p>
					</Part>
				</Put>

				<!-- In this Put, we're instantiating a new part that can be used somewhere else later. 
				But for now we're showing it on "mobile". -->
				<Put on="mobile">
					<Part ref="part2" id="part2">
						<h1>I'm part number two!</h1>
						<p>And some additional content.</p>
					</Part>
				</Put>
			</Phase>

			<Phase id="phase2" duration="3000">
				<!-- Here we're referencing @part1 and moving it to DSLWall.r1c3w1h1" -->
				<Put on="DSLWall" part="part2"></Put>

				<!-- We're also showing it at the endpoint "mobile." -->
				<Put on="DSLWall" part="part1"></Put>
			</Phase>

			<Phase id="phase3" duration="5000">
				<!-- Here we're referencing @part1 and moving it to DSLWall" -->
				<Put on="DSLWall" part="part1"></Put>

				<!-- We're also showing part1 it at the endpoint "mobile." -->
				<Put on="mobile" part="part2"></Put>
			</Phase>
  </div>
</template>

<script>
// @ is an alias to /src
import Part from '@/components/Part.vue'
import Phase from '@/components/Phase.vue'
import Put from '@/components/Put.vue'
import Place from '@/components/Place.vue'

export default {
  name: 'home',
  props:['placeId'],
  components: {
  	Part,
	Phase,
	Put,
	  Place
  },

  data() {
	  return {

	  }
  },

  methods: {
	  killAllParts(parts) {
		for (let i=0; i < parts.length; i++) {
			parts[i].deactivate();
		}
	  }
  },

  computed: {
	activePhase() {
		return this.$store.state.activePhase
	},

	activePuts() {
		return this.$store.state.activePuts;
	}
  },

  watch: {
	activePhase() {
		this.$children[this.activePhase].start();
	},

	activePuts() {
		this.killAllParts(this.$store.state.parts);

		for (let i = 0; i < this.activePuts.length; i++) {
			let place = this.activePuts[i].place;
			let part = this.activePuts[i].part;
			if(this.$refs[place] != undefined)
				this.$refs[part].activate();
		}
	}
  },

  mounted() {
		this.$children[this.activePhase].start();
  }
}
</script>
