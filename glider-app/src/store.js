import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const state = {
    currentPhase:0,
    parts : {}
}

const getters = {
    getCurrentPhase: state => {
        return state.currentPhase
    },

    getSharedPartAttributes: (state) => (part) => {
        console.log(state.parts);
        let ret = state.parts[part].attrs;

        if (ret != undefined)
            return ret;
    }
}

const mutations = {
    phaseActive(state, phase) {

    	firebase.database().ref().child("phase").set(phase);
        state.currentPhase = phase
    },

    registerPart(state,part) {
        state.parts[part.id] = part;
        firebase.database().ref().child("parts/"+part.id+'/attrs').set(part.attrs);
    },

    registerPartAttrs(state, part) {
        console.log("registering part attributes...");
        console.log(part.attrs);
        state.parts[part.id] = {};
        state.parts[part.id]['attrs'] = part.attrs;

        firebase.database().ref().child("parts/"+part.id+'/attrs').set(part.attrs);
    },

    updatePartAttr(state, part) {
        

        firebase.database().ref().child("parts/"+part.id+"/attrs/"+ part.attr.name).set(part.attr.val);
    }
}

const actions = {
    phaseActive(context, data) {
        context.commit('phaseActive', data)
    }
}

const remotePhase = firebase.database().ref().child('phase');
remotePhase.on('value', function(snapshot) {
      let myphase = snapshot.val();
      state.currentPhase = myphase;
});

const remoteParts = firebase.database().ref().child('parts');
remoteParts.on('value', function(snapshot) {
    let myparts = snapshot.val();
    state.parts = myparts;


});


export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
