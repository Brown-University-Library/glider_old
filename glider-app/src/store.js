import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {


  },
  mutations: {

  	updateFlightPlan(fp) {
  		this.state.flightPlan = fp;
  	}

  },
  actions: {

  }
})
