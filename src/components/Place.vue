<template>
  <div v-if="state=='inactive'" :class = "['place', 
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
      state:"active"
    }
  },

  methods: {
    // Places are pretty simple. Layout can be dictated by the CSS or given special properties
    setupLayout() {

    },

    activate() {
      this.state = "active";
    },

    deactivate() {
      this.state = "inactive";
    }
  },

  mounted(){

 }
}
</script>