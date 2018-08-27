<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
    <notifications position="top center"></notifications>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
<style lang="scss">
body {
  background-color: #f7f9fb;
}
</style>

