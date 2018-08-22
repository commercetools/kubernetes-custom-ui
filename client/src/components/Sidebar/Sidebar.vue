<template>
 <div class="sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-logo">
        <div class="peers ai-c fxw-nw">
          <div class="peer peer-greed">
            <router-link :to="{ name: 'Home' }" class="sidebar-link td-n">
              <div class="peers ai-c fxw-nw">
                <div class="peer">
                  <div class="logo text-center">
                    <img src="~@/assets/img/logo.png" alt="logo" class="logo" />
                  </div>
                </div>
                <div class="peer peer-greed">
                  <h5 class="lh-1 mb-0 logo-text d-none d-md-block"><b>Kubernetes</b>UI</h5>
                  <h5 class="lh-1 mb-0 logo-text d-block d-md-none"><b>K8s</b>UI</h5>
                </div>
              </div>
            </router-link>
          </div>
          <div class="peer">
            <div class="sidebar-toggle d-block d-md-none">
              <b-link class="sidebar-toggle" @click.prevent="setCollapse">
                <font-awesome-icon :icon="faArrowAltCircleLeft" />
              </b-link>
            </div>
          </div>
        </div>
      </div>

      <ul class="sidebar-menu scrollable pos-r">
        <li class="nav-item mT-30 pL-10 active">
          <router-link :to="{ name: 'Cronjobs' }" class="sidebar-link">
            <font-awesome-icon :icon="faClock" />
            <span class="title">Cronjobs</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faArrowAltCircleLeft from '@fortawesome/fontawesome-free-regular/faArrowAltCircleLeft'
import faClock from '@fortawesome/fontawesome-free-solid/faClock'

export default {
  methods: {
    setCollapse () {
      this.SET_IS_SIDEBAR_COLLAPSED(!this.isSidebarCollapsed)
    },
    ...mapMutations('general', ['SET_IS_SIDEBAR_COLLAPSED']),
  },
  computed: {
    faArrowAltCircleLeft () {
      return faArrowAltCircleLeft
    },
    faClock () {
      return faClock
    },
    ...mapState('general', ['isSidebarCollapsed']),
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
<style lang="scss" scoped>
.sidebar {
  .sidebar-inner {
    .sidebar-logo {
      .sidebar-link {
        padding: 12px 0px;
      }

      .logo {
        width: 70px;
        min-height: 0px;
      }
      img {
        &.logo {
          height: 40px;
          width: auto;
          min-height: 0px;
        }
      }
    }
  }
}
</style>
