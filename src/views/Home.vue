<template>
  <div :ref="placeId" :class="['glider-root', placeId]">
		<Phase id="phase1" duration="15000">
			<Put on="DXLWall" region="r1c1w1h1">
				<!-- Here we're defining a part (i.e., some content) 
					and using it at the 
					same time, showing it on a specific DXLWall region -->
				<Part ref="part1" id="part1">
					<h1>Blahdeeblah I'm Part1</h1>
					<p>And some content and stuff.</p>
				</Part>
			</Put>

			<!-- In this Put, we're instantiating a new part that can be used somewhere else later. We're calling it @part2 
			But for now we're showing it on "mobile". -->
			<Put on="DXLWall" region="r1c2w1h1">
				<Part ref="part2" id="part2">
					<h1>I'm part number two!</h1>
					<p>And some additional content.</p>
				</Part>
			</Put>

			

		</Phase>

		<Phase id="phase2" duration="3000">
			<!-- Here we're referencing @part2 and moving it to a new DXLWall region" -->
			<Put on="DXLWall" region="r1c1w1h1" part="part2"></Put>

			<!-- New spot for Part1 -->
			<Put on="DXLWall" region="r1c2w1h1" part="part1"></Put>
		</Phase>

		<Phase id="phase3" duration="5000">
			<!-- Here we're referencing @part1 and moving it to a specific DXLWall region" -->
			<Put on="DXLWall" region="r1c1w1h1" part="part1"></Put>

			<!-- We're also showing part1  at the endpoint "mobile." -->
			<Put on="mobile" part="part1"></Put>
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
			let put = this.activePuts[i];
			let place = this.activePuts[i].place;
			let part = this.activePuts[i].part;
			let region = this.activePuts[i].region;
			console.log(`Place ${place} gets Part ${part}`);
			if(this.$refs[place] != undefined) {				

				let partComp = this.$refs[part.part];

				if(part.ref == true) {
					partComp.$el.parentNode.removeChild(partComp.$el);
					this.$children[this.activePhase].$el.appendChild(partComp.$el);
				}

				partComp.activate();
				
			}
		}
	}
  },

  mounted() {
		this.$children[this.activePhase].start();
  }
}
</script>
