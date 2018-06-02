<template>
  <div id="app">
    <div class="container-fluid">
      <router-view></router-view>
      <vue-progress-bar></vue-progress-bar>
    </div>
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

