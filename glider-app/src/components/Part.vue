<template>
  <div v-if="state=='active'" :class = "['part', 
                  'part-' + this.id, 
                  'state-' + state]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Part',
  props: {
    id: String,
    state:{
      type: String,
      default:"inactive"
    }
  },

  data() {
    return {

    }
  }
}
</script>
