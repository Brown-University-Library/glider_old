<template>
  <div v-show="state=='active'" :class="['phase', placeId]">
    <slot></slot>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Phase',
  props: {
    id: String,
    duration: String,
    first: String,
    placeId:String
  }, 

  data() {
    return {
      phaseDuration: this.duration,
      state:"inactive",
      type:String,
      nextPhase:Object,
      timer: Object
    }
  },

  mounted() {
    // update to filter on Puts
    this.puts = this.$children;

    this.$store.dispatch('registerPhase', this);
  },

  computed: {
    childPhases() {
      this.$children.filter(comp => comp.$options.name === 'Phase')
    }
  },

  methods: {
  	start(){
      // kicks off the phase
      this.notifyActive();

      let PP = [];

      for(let i = 0; i < this.puts.length; i++) {
        let put = this.puts[i];
        let part = put.content;
        let region = put.region;
        let place = put.on;

        PP.push({put:put,part:part, place:place, region:region});

        //console.log(`Tell ${place} to show ${part}`);

      }

      this.$store.dispatch("updateActivePuts", PP);

      
      if(this.duration !== undefined)
        this.doTimeout();
    },
    
    //engages the timer
    doTimeout() {
      console.log("triggering timeout");
      let that = this;
      let after = function(){ that.complete() };
      let d = +this.duration;
      this.timer = setTimeout(after,d);
    },

    complete() {
      clearTimeout(this.timer);
      this.notifyInactive();
    },

    notifyActive() {
      this.state="active";
      this.$store.dispatch('phaseActive', this);
    },

    notifyInactive(){
      for (let i = 0; i < this.puts.length; i++) {
        console.log("kill da puts");
      }
      this.state="inactive";
      this.$store.dispatch('phaseInactive', this);
    }

  }
}
</script>
