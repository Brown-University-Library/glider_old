<template>
  <div v-bind:style="styleObject" v-if="state=='active'" :class = "['part', 
                  'part-' + this.id, 
                  'state-' + state]">
    <h2>Shared attribute bgColor: {{this.attrs.bgColor}}</h2>

    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Part',
  inherit: true,
  props: {
    id: String,
    // comes from the def in markup
    shared:String     
  },

  data() {
    return {
      state: "inactive",
      views:[],
      styleObject: {},
      // mutable attributes (shared stuff)
      
      activeView: null
    }
  },

  computed: {
    ...mapGetters({
        partAttrs: 'getSharedPartAttributes'
    }),

    attrs: function (ctx) {
      return ctx.partAttrs(ctx.id)
    },

    styleObject: function() {
      
    }

  },

  updated() {
    this.populateViews();
    let v = this.getViewById(this.activeView);
    if(v !== undefined) v.updateState("active");
    console.log("updateyguy");

    this.styleObject.backgroundColor = this.attrs.bgColor;

    console.log(this.styleObject);

  },

  mounted() {

    let that = this;

    if(that.shared != undefined) {

      let thing = {
        id:that.id,
        attrs: JSON.parse(that.shared)
      };

      this.$store.commit('registerPartAttrs', thing);
      
      this.styleObject.backgroundColor = this.attrs.bgColor;
    }

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

    deactivate() {
      this.state = "inactive";
    },

    activate(view){
      this.state = "active";
      this.activeView = view;
      //this.activeView.activate();
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

      this.styleObject['gridRow'] = parsedRegion.gridRow;
      this.styleObject['gridColumn'] = parsedRegion.gridColumn
      
    }, 

    updateSharedAttribute(attr, val) {
      this.attrs[attr] = val;
    }
  }
}
</script>
