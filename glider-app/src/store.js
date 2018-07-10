import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const state = {
    currentPhase:0,
    
}

const getters = {
    getCurrentPhase: state => {
        return state.currentPhase
    }
}

const mutations = {
    phaseActive(state, phase) {
    	console.log("updating phase to " + phase);
    	firebase.database().ref().child("phase").set(phase);
        state.currentPhase = phase
    }
}

const actions = {
    phaseActive(context, data) {
        context.commit('phaseActive', data)
    }
}



export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
