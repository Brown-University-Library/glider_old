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
    id: String
  },

  data() {
    return {
      state: "inactive"
    }
  },

  methods: {
    updateState(state) {
      this.state=state;
    }
  }
}
</script>
