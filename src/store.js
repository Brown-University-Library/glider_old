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
      firebase.database().ref().child("phase").set(phaseIndex);
 
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
      firebase.database().ref().child("phase").set(this.state.activePhase+1);
      //this.commit("updatePhase", this.state.activePhase +1)
    },

    phaseActive(phase) {
     firebase.database().ref().child("phase").set(this.state.activePhase);
      let that = this;
      const remotePhase = firebase.database().ref().child('phase');
      remotePhase.on('value', function(snapshot) {
            let myphase = snapshot.val();
            that.state.activePhase = myphase;
      });
    },

    updateActivePuts(context,data){
      context.commit("updateActivePuts", data);
    },

    registerPart(context,data) {
      context.commit("registerPart", data);
    }
  }
})
