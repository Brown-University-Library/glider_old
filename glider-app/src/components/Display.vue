<template>
  <div class="display">
    <slot></slot>
  </div>
</template>

<script>
import Part from '@/components/Part.vue'
import Place from '@/components/Place.vue'
export default {
  	name: 'Display',
	props : {
		state:{
		  type: String,
		  default:"inactive"
		},

		part:Part,
		place: Place,
		region: String
	}
}
</script>
