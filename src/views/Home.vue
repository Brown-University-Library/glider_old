<template>
  <div :ref="placeId" :class="['glider-root', placeId]">
		<Phase id="phase1">
			<Put on="DXLWall" region="r1c1w2h1">
				<!-- Here we're defining a part (i.e., some content) 
					and using it at the 
					same time, showing it on a specific DXLWall region -->
				<Part ref="welcomevid" id="welcomevid">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/Composition_1.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>

			<!-- In this Put, we're instantiating a new part that can be used somewhere else later. We're calling it @part2 
			But for now we're showing it on "mobile". -->
			<Put on="DXLWall" region="r2c1w1h1">
				<Part ref="todaysweather" id="todaysweather">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/left-weather-today.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>

			<!-- In this Put, we're instantiating a new part that can be used somewhere else later. We're calling it @part2 
			But for now we're showing it on "mobile". -->
			<Put on="DXLWall" region="r2c2w1h1">
				<Part ref="tomorrowsweather" id="tomorrowsweather">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/right-weather-tomorrow.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>

			<Put on="mobile">
				<Part id="mobile-content-1" ref="mobile-content-1">
					<h1>Welcome! Check out the screens for stuff you might like. Sorry we made your phone download all this!</h1>
				</Part>
			</Put>


		</Phase>

		<Phase id="studentwork1">
			<!-- Here we're referencing @part2 and moving it to a new DXLWall region" -->
			<Put on="DXLWall" region="r1c1w1h1">
				<Part ref="student-work-1" id="student-work-1">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/1.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>

			<!-- New spot for Part1 -->
			<Put on="DXLWall" region="r1c2w1h1">
				<Part ref="student-work-2" id="student-work-2">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/2.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>

			<Put on="DXLWall" region="r2c1w1h1">
				<Part ref="student-work-3" id="student-work-3">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/3.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>

			<Put on="DXLWall" region="r2c2w1h1">
				<Part ref="student-work-4" id="student-work-4">
					<video autoplay width="320" height="240" loop muted>
						<source src="assets/4.mp4" type="video/mp4">
					</video>
				</Part>
			</Put>			

			<Put on="mobile">
				<Part id="mobile-content-2" ref="mobile-content-2">
					<h1>Hey, look up at the screen to see some work!</h1>
				</Part>
			</Put>

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
  props:{
		placeId:String,
		canControl:{
			type:String
		}
	},
  components: {
  	Part,
	Phase,
	Put,
	Place
  },

  data() {
	  return {
		  initialPhaseIndex:Number,
		  outerPhases:[]
	  }
  },

  methods: {
	  killAllParts(parts) {
		for (let i=0; i < parts.length; i++) {
			parts[i].deactivate();
		}
	  },

	mapPhases() {

		for(let i = 0; i < this.outerPhases.length; i++) {
			this.outerPhases[i].nextPhase = this.outerPhases[i+1];
		}
	}
  },

  computed: {
	inFlight() {
		return this.$store.state.inFlight;
	},
	pusher() {
		return (this.canControl == "true");
	},
	activePhase() {
		return this.$store.state.activePhase
	},

	activePuts() {
		return this.$store.state.activePuts;
	}
  },

  watch: {
	activePhase() {
		this.activePhase.start();
	},

	activePuts() {
		this.killAllParts(this.$store.state.parts);

		for (let i = 0; i < this.activePuts.length; i++) {
			let put = this.activePuts[i];
			let place = this.activePuts[i].place;
			let part = this.activePuts[i].part;
			let region = this.activePuts[i].region;
			console.log(`Place ${place}.${region} gets Part ${part.part}`);
			if(this.$refs[place] != undefined) {				

				// reference to the part component
				let partComp = this.$refs[part.part];

				if(part.ref == true) {
					
					partComp.$el.parentNode.removeChild(partComp.$el);
					put.put.$el.appendChild(partComp.$el);
				}

				partComp.activate();
				
			}
		}
	}
  },

  mounted() {
		this.outerPhases = this.$children.filter(comp => comp.$options.name === 'Phase');

		this.$store.dispatch('registerPusherStatus', this.pusher);
		if(this.pusher) {
			console.log("doing a keyboard controller");
			let that = this; 
			document.onkeydown = function(e) {
				e = e || window.event;
				if (e.keyCode == '39') {
					that.activePhase.complete();
				}
				else if (e.keyCode == '37') {
					// go to previous phase somehow
				}
			}
		}

		this.mapPhases();

		this.$store.dispatch('registerOuterPhases', this.outerPhases).then(response => {
			this.$store.dispatch('updatePhase', this.outerPhases[0]);
        }, error => {
            console.error("Got nothing from store for some reason.")
		});
		

  }
}
</script>
