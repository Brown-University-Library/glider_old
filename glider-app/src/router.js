import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PlaceView from './views/PlaceView.vue'
import FlightPlan from './components/FlightPlan.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:placeId',
      name: 'home',
      component: Home,
      props:true
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: About
    // },

    // {
    //   path: '/place/:id',
    //   name: 'PlaceView',
    //   component: PlaceView,
    //   props:true
    // }

    {
      path:'/place/:placeId',
      name:'PlaceView',
      component:FlightPlan,
      props:true
    }
  ]
})
