<template>
  <div v-if="state=='active'" :class = "['place', 
                  'place-' + this.id, 
                  'state-' + state]">
                  <h2>You are looking at {{this.id}}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Place',
  props: {
    id: String,
    type: String,
    rows: String,
    columns: String
  },

  data() {
    return {
      state:"inactive"
    }
  },

  mounted(){
    switch(this.type) {
      case "grid":
        // set up styles for the grid based on columns and rows
        console.log(this.rows);
        console.log(this.columns);
      break;
    }
  }
}
</script>