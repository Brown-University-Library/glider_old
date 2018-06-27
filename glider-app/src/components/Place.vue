<template>
  <div :class="">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Place',
  props: {
    id: ''
  },

  data() {
    return {
    }
  }
}
</script>