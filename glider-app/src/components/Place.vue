<template>
  <div v-if="state=='active'" :class = "['place', 
                  'place-' + this.id, 
                  'state-' + state]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Place',
  props: {
    // or "Role"
    id: String,
    // or "Layout"
    type: String,
    rows: String,
    columns: String
  },

  data() {
    return {
      state:"inactive"
    }
  },

  methods: {
    setupLayout() {
      switch(this.type) {
        case "grid":

        break;

        default:

        break; 

      }
    }
  },

  mounted(){
    this.setupLayout();
  }
}
</script>