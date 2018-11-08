<template>
  <div v-show="state=='active'" :class = "['part', 
                  'part-' + this.id, 'attr-'+atts]" :style="styleObject">
    <slot>

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

    atts: function (ctx) {
      return ctx.partAttrs(ctx.id)
    }
  },

  watch: {

  },

  updated() {
    this.populateViews();
    let v = this.getViewById(this.activeView);
    if(v !== undefined) v.updateState("active");
  },

  mounted() {


    this.$store.dispatch('registerPart', this);

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
    }
  }
}
</script>
