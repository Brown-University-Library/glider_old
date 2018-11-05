import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePhase: 0,
    activePuts: [],
    parts: [],
    activeParts:[],
    places: []
  },
  mutations: {

    updatePhase(state,phaseIndex) {
      state.activePhase = phaseIndex;
    },

    updateActivePuts(state, data) {
      state.activePuts = data;
      // console.log("updated...");
      // console.log(data);
    },

    updateActiveParts(state,data) {
      state.activeParts = data;
    },

    registerPart(state, data) {
      state.parts.push(data);
    }

  },
  actions: {
    updatePhase(context,phaseIndex) {
      context.commit('updatePhase', phaseIndex);
    },

    phaseInactive(phase) {
      console.log('store knows about inactive');
      
      this.commit("updatePhase", this.state.activePhase +1)
    },

    phaseActive(phase) {
      console.log('store knows about active');
    },

    updateActivePuts(context,data){
      context.commit("updateActivePuts", data);
    },

    registerPart(context,data) {
      conext.commit("registerPart", data);
    }
  }
})
