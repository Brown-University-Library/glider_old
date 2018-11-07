import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePhase: Object,
    activePuts: [],
    parts: [],
    activeParts:[],
    places: [],
    outerPhases:[]
  },
  mutations: {

    updatePhase(state,phaseObject) {
      //firebase.database().ref().child("phase").set(phaseObject.id);
      state.activePhase = phaseObject;
    },

    updateActivePuts(state, data) {
      state.activePuts = data;
    },

    updateActiveParts(state,data) {
      state.activeParts = data;
    },

    registerPart(state, data) {
      state.parts.push(data);
    },

    registerOuterPhases(state,data) {
      state.outerPhases = data;
    }
  },
  actions: {
    updatePhase(context,phase) {
      context.commit('updatePhase', phase);
    },

    phaseInactive(phase) {
      //firebase.database().ref().child("phase").set(this.state.activePhase+1);
      if(this.state.activePhase.nextPhase!= undefined)
        this.commit("updatePhase", this.state.activePhase.nextPhase)
    },

    phaseActive(context,phase) {
      context.commit('updatePhase',phase);
      //this.state.activePhase = phase;
    },

    updateActivePuts(context,data){
      context.commit("updateActivePuts", data);
    },

    registerPart(context,data) {
      context.commit("registerPart", data);
    },

    registerOuterPhases(context, phases){
      context.commit('registerOuterPhases', phases);
    }
  }
})
