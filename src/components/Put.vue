<template>
  <div class="put" :style="styleObject">
    <slot></slot>
  </div>
</template>

<script>
import Part from '@/components/Part.vue'
export default {
  name: 'Put',
	props : {
		state: {
		  type: String,
		  default:"inactive"
		},
		part:String,
		place:String,
		on:String,
		region:String
	},

	data() {
		return {
			styleObject:{}
		}
	},

	methods: {

		getParsedRegionObject(region) {

	      // example: r1c1w1h1

	      let r = region.split("r")[0].split("c")[1];
	      let c = region.split("w")[0].split("c")[1];
	      let w = region.split("h")[0].split("w")[1];
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
	      
	      console.log(parsedRegion);
	      
	      this.styleObject['display'] = "grid";
	      this.styleObject['gridRow'] = parsedRegion.gridRow;
	      this.styleObject['gridColumn'] = parsedRegion.gridColumn
	      
	      console.log(this.styleObject);
	      
	    }

	},

	computed: {
		content(){
			if(this.part != undefined) {
				return this.part;
			} else {
				return this.$children[0].id;
			}
		}
		// ,

		// region() {
		// 	return {
		// 		gridRow:this.gridRows + " / span " + this.spanRows,
		// 		gridColumn:this.gridCols + " / span " + this.spanCols
		// 	}
		// }
	},

	mounted() {

		this.styleObject = {};

		if(this.region != undefined)
			this.applyRegionStyles();
	}
}
</script>