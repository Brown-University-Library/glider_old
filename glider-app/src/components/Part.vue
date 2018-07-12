<template>
  <div v-bind:style="styleObject" v-if="state=='active'" :class = "['part', 
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
      state: "inactive",
      styleObject: {},
      // mutable attributes (shared stuff)
      shared:{},
      views:[],
      activeView: null
    }
  },

  computed: {
    // state: () => this.$store.getters.getPartState(this.id),
    // styleObject: () => this.$store.getters.getPartStyle(this.id),
    // views: () => this.$store.getters.getPartViews(this.id)
  },

  updated() {
    this.populateViews();
    let v = this.getViewById(this.activeView);
    if(v !== undefined) v.updateState("active");
  },

  mounted() {
   //this.populateViews();
  },

  methods: {

    populateViews()  {
      this.views = this.$children;
    },

    getViewById(id) {
      let v = this.views.find(function (view) { return view.id == id; });
      return v;
    },

    updateState(state) {
      this.state = state;
    },

    activate(view){
      this.state = "active";
      this.activeView = view;
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

    updateSharedAttribute(attr, val) {
      this.shared[attr] = val;
    }
  }
}
</script>
