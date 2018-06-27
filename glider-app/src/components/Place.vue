<template>
  <div v-if="state=='active'" :class = "['place', 
                  'place-' + this.id, 
                  'state-' + state]">
                  <h2>{{this.id}} is Active</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Place',
  props: {
    id: String,
    type: String
  },

  data() {
    return {
      state:"inactive"
    }
  }
}
</script>