<template>
  <div class="phase">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Phase',
  props: {
    id: String,
    state:String
  }, 

  data() {
    return {
  	// id: Number,
  	// state: String
    }
  },

  methods: {
  	start(){
  		// kicks off the phase
  	},

  	goTo(phaseId) {
  		// iniates transition to specified subphase?
  	}

  }
}
</script>
