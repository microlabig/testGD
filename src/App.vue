<template lang="pug">  
  .app-root
    interfaceIphoneX    
</template>

<script >
  import interfaceIphoneX from "./components/interfaceIphoneX.vue";

  export default {
    name: 'app',
    
    components: {    
      interfaceIphoneX
    }
  }
</script>

<style lang="postcss">
  .app-root {     
    height: 100%;
    padding: 15px;
  }
</style>


