<template>
  <div class="header navbar">
    <div class="header-container">
      <ul class="nav-left">
        <li>
          <b-link class="sidebar-toggle" @click.prevent="setCollapse">
            <font-awesome-icon :icon="faBars" />
          </b-link>
        </li>
      </ul>
      <ul class="nav-right">
        <li>
          <b-link class="sign-out"  href="" @click.prevent="signOut">
            <span class="fsz-sm fw-600 c-grey-900 d-none d-sm-inline">Log out</span>
            <font-awesome-icon :icon="faSignOutAlt" />
          </b-link>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt'

export default {
  methods: {
    signOut() {
      this.SIGN_OUT()
      this.$router.push({ name: 'Home' })
    },
    setCollapse() {
      this.SET_IS_SIDEBAR_COLLAPSED(!this.isSidebarCollapsed)
    },
    ...mapActions('authentication', ['SIGN_OUT']),
    ...mapMutations('general', ['SET_IS_SIDEBAR_COLLAPSED']),
  },
  computed: {
    faBars() {
      return faBars
    },
    faSignOutAlt() {
      return faSignOutAlt
    },
    ...mapState('general', ['isSidebarCollapsed']),
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>

<style lang="scss" scoped>
</style>

