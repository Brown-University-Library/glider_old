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
    // Places are pretty simple. Layout can be dictated by the CSS or given special properties
    setupLayout() {
      switch(this.type) {
        case "grid":

        break;

        default:

        break; 

      }
    },

    activate() {
      this.state = "active";
    },

    deactivate() {
      this.state = "inactive";
    }
  },

  mounted(){
    this.setupLayout();
  }
}
</script>