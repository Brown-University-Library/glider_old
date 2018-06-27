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
  }
}
</script>
