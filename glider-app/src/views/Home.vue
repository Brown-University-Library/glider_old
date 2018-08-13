<template>
	<div class="glider">
      <!-- Timing: Activation in turn based on duration -->
        <div phase-type="seq" phase-repeatcount="indefinite" id="r7">
          <div phase-duration="12s" id="r8">
            One
          </div>
          <div phase-duration="2s" id="r9" part-type="blue">
            Two
          </div>
          <div phase-duration="4s" id="r10">
            Three
          </div>
        </div> 
    </div>
</template>

<script>
// @ is an alias to /src
import PartsList from '@/components/PartsList.vue'
import PhaseList from '@/components/PhaseList.vue'
import DisplayList from '@/components/DisplayList.vue'
import PlaceList from '@/components/PlaceList.vue'
import Part from '@/components/Part.vue'
import PartView from '@/components/PartView.vue'
import Place from '@/components/Place.vue'
import Phase from '@/components/Phase.vue'
import Display from '@/components/Display.vue'
import KeyboardController from '@/components/KeyboardController.vue'

export default {
  name: 'home',
  props:['placeId'],
  components: {
    Part,
    Place,
    Phase,
    Display,
    PartsList,
    PhaseList,
    DisplayList,
    PlaceList,
    PartView,
    KeyboardController
  }
}
</script>
