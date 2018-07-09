<template></template>
<script>
import store from '@/store'
export default {
  name: 'KeyboardController',
  created() {
    console.log("doing a keyboard controller");
    let that = this; 
    document.onkeydown = function(e) {
        e = e || window.event;
        if (e.keyCode == '39') {
           that.$store.commit("phaseActive", that.$store.getters.getCurrentPhase+1);
        }
        else if (e.keyCode == '37') {
           that.$store.commit("phaseActive", that.$store.getters.getCurrentPhase-1);
        }
    }
  }
}
</script>