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

		part:Part,
		place:String,
		region: String
	}
}
</script>