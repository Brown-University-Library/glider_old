<template>
    <div v-show="state=='active'" :class = "['part', 
                  'part-' + this.id]" :style="styleObject">
        <iframe :src="src" :width="width" :height="height" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
</template>

<script>
import Part from '@/components/Part.vue'
export default {
  extends: Part,
  props: {
    id: String,
    height:String,
    width:String,

    type: String,

    src:String     
  },

  data() {
    return {

    }
  }
}
</script>
