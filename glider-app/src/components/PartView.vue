<template>
  <div v-bind:style="styleObject" v-if="state=='active'" :class = "['partView', 
                  'partView-' + this.id, 
                  'state-' + state]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PartView',
  props: {
    id: String
  },

  data() {
    return {
      state: "inactive",
      styleObject: {},
      attrs:{},
      displays:[]
    }
  },

  updated() {

  },
  
  methods: {
    updateState(state) {
      this.state = state;
    },

    getParsedRegionObject(region) {

      // example: r1c1w1h1

      let r = region.split("c")[0].split("r")[1];
      let c = region.split("w")[0].split("c")[1];
      let w = region.split("h")[0].split("w")[1];
      let h = region.split("h")[1];


      let gr = r + " / span " + h;
      let gc = c+ " / span " + w;

      return {
        gridRow: gr,
        gridColumn: gc
      }
    },

    putInRegion(region) {
      
      //parse the region
      let parsedRegion = this.getParsedRegionObject(region);

      this.styleObject = {
        gridRow:parsedRegion.gridRow,
        gridColumn:parsedRegion.gridColumn
      }
    }, 

    updateAttribute(attr, val) {
      this.attrs[attr] = val;
    }
  }
}
</script>
