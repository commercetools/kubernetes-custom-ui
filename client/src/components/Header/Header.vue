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
        <li class="list-item list-item__environments">
          <select class="form-control" v-model="selectedEnvironment">
            <option v-for="env in environments" :key="env.key" :value="env.key">
              {{ env.name }}
            </option>
          </select>
        </li>
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
import EnvironmentsService from '@/services/environments'

const environmentsService = EnvironmentsService()

export default {
  data () {
    return {
      environments: null,
      selectedEnvironment: null,
    }
  },
  created () {
    this.getEnvironments()
  },
  methods: {
    signOut () {
      this.SIGN_OUT()
      this.$router.push({ name: 'Home' })
    },
    setCollapse () {
      this.SET_IS_SIDEBAR_COLLAPSED(!this.isSidebarCollapsed)
    },
    getDefaultEnvironment (environments) {
      return this.environment || environments[0].key
    },
    async getEnvironments () {
      return environmentsService.find().then((environments) => {
        this.environments = environments
        this.selectedEnvironment = this.getDefaultEnvironment(this.environments)
      }).catch((err) => {
        this.$notify({ type: 'error', text: err.message })
      })
    },
    ...mapActions('authentication', ['SIGN_OUT']),
    ...mapMutations('general', ['SET_IS_SIDEBAR_COLLAPSED', 'SET_ENVIRONMENT']),
  },
  computed: {
    faBars () {
      return faBars
    },
    faSignOutAlt () {
      return faSignOutAlt
    },
    ...mapState('general', ['isSidebarCollapsed', 'environment']),
  },
  components: {
    FontAwesomeIcon,
  },
  watch: {
    selectedEnvironment: 'SET_ENVIRONMENT',
  },
}
</script>

<style lang="scss" scoped>
.list-item__environments {
  padding: 15px;
}
</style>

