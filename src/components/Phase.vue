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
      state:"inactive"
    }
  },

  mounted() {
    this.puts = this.$children;
  },

  computed: {
    
  },

  methods: {
  	start(){
      // kicks off the phase
      this.notifiyActive();

      let PP = [];

      for(let i = 0; i < this.puts.length; i++) {
        let put = this.puts[i];
        let part = put.content;
        let region = put.region;
        let place = put.on;

        PP.push({part:part, place:place, region:region});

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
      setTimeout(after,d);
    },

    complete() {
      this.notifyInactive();
    },

    notifiyActive() {
      this.state="active";
      console.log(`Phase ${this.id} is active`);
      this.$store.dispatch('phaseActive', this)
    },

    notifyInactive(){
      this.state="inactive";
      console.log(`Phase ${this.id} no longer active after ${this.duration} ms` );
      console.log("It's time to trigger the next phase! Tell App.JS (or Home, or $store)!");
      

      this.$store.dispatch('phaseInactive', this)
    }

  }
}
</script>
