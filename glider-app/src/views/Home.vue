<template>
<FlightPlanTwo :placeId = "placeId">

  <div :class="['wrap-everything']">
  
    <div class="glider-root" id="main-slideshow" phase-type="par">
  <!-- Basic seq/par designation. 
            Heading stays throughout; One, Two, Three are each activated in turn. -->
      <div phase-type="par" place="DSLWall" region="r1c1w2h1"id="r1">
        <h1 id="r2">
          Here is some HTML, with <span id="r21">nested elements</span>, and even 
          <span id="r22"><span id="r221">nested</span> within nested</span>.
        </h1>

        <h1 id="s2" part-id="part1" part-type="green">
          Here is some HTML, with <span id="r21">nested elements</span>, and even 
          <span id="r22"><span id="r221">nested</span> within nested, but 
          with a <span phase-begin="3s">phase definition</span></span>.
        </h1>

        <div phase-type="seq" id="r3">
          <div id="r4" part-type="red">
            One
          </div>
          <div id="r5">
            Two
          </div>
          <div id="r6">
            Three
          </div>
        </div>
      </div>
      
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
      
      <!-- Order of activation according to specific start times: 
            First, Second, Third, Fourth (Third de-activates after 3 seconds) -->
      <ul phase-type="par" id="r11">
        <li phase-begin="2s" id="r12">First</li>
        <li phase-begin="6s" phase-duration="3s" id="r13">Third</li>
        <li phase-begin="4s" id="r14">Second</li>
        <li phase-begin="8s" id="r15">Fourth</li>
      </ul>
    </div>



  </div>
</FlightPlanTwo>
</template>
<script>
// @ is an alias to /src
import FlightPlanTwo from '@/components/FlightPlan-Dev.vue'

export default {
  name: 'Home',
  props:['placeId'],
  components: {
    FlightPlanTwo
  }
}
</script>