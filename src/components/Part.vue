<template>
  <div v-show="state=='active'" :class = "['part', 
                  'part-' + this.id]" :style="styleObject">
    <slot>
      {{id}}
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Part',
  inherit: true,
  props: {
    id: String,
    // comes from the def in markup. copied to attrs below.
    shared:String     
  },

  data() {
    return {
      views:[],     
      styleObject:{},
      state:"inactive",
      activeView: null
    }
  },

  computed: {
    ...mapGetters({
        // mutable attributes (shared stuff)
        partAttrs: 'getSharedPartAttributes'
    }),

    attrs: function (ctx) {
      return ctx.partAttrs(ctx.id)
    }
  },

  updated() {
    this.populateViews();
    let v = this.getViewById(this.activeView);
    if(v !== undefined) v.updateState("active");

    console.log("component updated");
  },

  mounted() {

    let that = this;

    if(that.shared != undefined) {

      let thing = {
        id:that.id,
        attrs: JSON.parse(that.shared)
      };

      //this.$store.commit('registerPartAttrs', thing);
      
      this.styleObject.backgroundColor = this.attrs.bgColor;
    }

          this.$store.commit('registerPart', this);

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
      //this.activeView = view;
      //this.activeView.activate();
    },

    updateSharedAttribute(attr, val) {
      this.attrs[attr] = val;
    }
  }
}
</script>
