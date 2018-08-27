<template>
  <div class="dashboard" :class="{ 'is-collapsed': isSidebarCollapsed }">
    <sidebar></sidebar>
    <div class="page-container">
      <header-component></header-component>
      <main-container></main-container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import MainContainer from '@/components/MainContainer'

export default {
  computed: {
    ...mapState('general', ['isSidebarCollapsed']),
  },
  components: {
    HeaderComponent: Header,
    Sidebar,
    MainContainer,
  },
}
</script>

<style lang="scss">
@import "~@/assets/scss/adminator/index";
</style>

