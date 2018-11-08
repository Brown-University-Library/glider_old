import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

  const state = {
    activePhase: Object,
    isPusher:false,
    inFlight:false,
    activePuts: [],
    parts: [],
    activeParts:[],
    places: [],
    allPhases:{},
    outerPhases:[]
  }

 const mutations = {

    updatePhase(state,phaseObject) {
      pushRemote("phase", phaseObject.id);

      const remotePhase = firebase.database().ref().child('phase');
      remotePhase.on('value', function(snapshot) {
            let myphase = snapshot.val();
            state.activePhase = state.allPhases[myphase];
      });


      state.activePhase = phaseObject;
    },

    registerPhase(state, phase) {
      state.allPhases[phase.id] = phase;
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
    },

    registerPusherStatus(state, data) {
      state.isPusher = data;
    }
  }
  const actions = {
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
    },

    registerPusherStatus(context, data) {
      context.commit('registerPusherStatus', data);
    },

    registerPhase(context, phase) {
      context.commit('registerPhase', phase);
    }
  }

  function pushRemote(path, value) {
    if (state.isPusher)
      firebase.database().ref().child(path).set(value);
  }

  

  // ** RemoteyGuys **/

 

  export default new Vuex.Store({
    state,
    mutations,
    actions
})
