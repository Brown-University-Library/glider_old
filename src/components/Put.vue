<template>
  <div v-show="state=='active'" class="put" :style="styleObject">
    <slot></slot>
  </div>
</template>

<script>
import Part from '@/components/Part.vue'
export default {
  name: 'Put',
	props : {
		part:String,
		place:String,
		on:String,
		region:String
	},

	data() {
		return {
			styleObject:{},
			state:"active",
			referencesAnotherPart:false
		}
	},

	methods: {

		getParsedRegionObject(region) {

	      // example: r1c1w1h1

 		  	let r = region.split("r")[1].split("c")[0];
	      let c = region.split("w")[0].split("c")[1];
	      let w = region.split("w")[1].split("h")[0];
	      let h = region.split("h")[1];


	      let gr = r + " / span " + h;
	      let gc = c+ " / span " + w;

	      return {
	        gridRow: gr,
	        gridColumn: gc
	      }
	    },

	    applyRegionStyles() {
	      
	      //parse the region
	      let parsedRegion = this.getParsedRegionObject(this.region);
	      
	      
	      this.styleObject['display'] = "grid";
	      this.styleObject['gridRow'] = parsedRegion.gridRow;
	      this.styleObject['gridColumn'] = parsedRegion.gridColumn
	      
	      
	    }

	},

	computed: {
		content(){
			// if the Part in this Put is a REFERENCE to a previously-created part
			if(this.part != undefined) {
				let ret = {
					part:this.part,
					ref:true
				}
				return ret;
			} else {
				// If the Part is created inside the Put
				let ret = {
					part:this.$children[0].id,
					ref:false
				}

				return ret;
			}
		}
	},

	mounted() {

		this.styleObject = {};

		if(this.region != undefined)
			this.applyRegionStyles();
	}
}
</script>