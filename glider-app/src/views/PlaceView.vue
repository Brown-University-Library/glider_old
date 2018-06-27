<template>
  <div class="place">
    <h1>This view is representing place {{id}}</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import Place from '@/components/Place.vue'

export default {
  name: 'PlaceView',
  props:['id'],
  components: {
    Place
  }
}
</script>
