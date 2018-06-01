<template>
  <div id="app">
    <div class="container-fluid">
      <sign-in/>
      <vue-progress-bar></vue-progress-bar>
    </div>
  </div>
</template>

<script>
import SignIn from './components/SignIn'

export default {
  name: 'App',
  components: {
    SignIn,
  },
}
</script>
<style lang="scss">
body {
  background-color: #f7f9fb;
}
</style>

