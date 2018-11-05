<template>
  <div class="put">
    <slot></slot>
  </div>
</template>

<script>
import Part from '@/components/Part.vue'
export default {
  name: 'Put',
	props : {
		state:{
		  type: String,
		  default:"inactive"
		},
		part:String,
		place:String,
		on:String,
		region: String
	},

	computed: {
		content(){
			if(this.part != undefined) {
				return this.part;
			} else {
				return this.$children[0].id;
			}
		}
	}
}
</script>