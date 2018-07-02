<template>
  <div class="cronjobs">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="bgc-white bd bdrs-3 p-20 mB-20">
            <h4 class="c-grey-900 mB-10">Cronjobs</h4>
            <button type="submit" @click="getCronjobs"
              class="btn btn-primary btn-sm float-right mB-20">
              Refresh
              <font-awesome-icon :icon="faUndo" />
            </button>
            <table id="dataTable" class="table table-bordered table-responsive-sm"
              cellspacing="0" width="100%">
              <thead>
                <tr>
                  <sortable-header
                    :sortBy="sortBy"
                    :header="{ value: 'status', label: 'Status'}"
                    @sort="onSorted">
                  </sortable-header>
                  <sortable-header
                    :sortBy="sortBy"
                    :header="{ value: 'name', label: 'Cronjob'}"
                    @sort="onSorted">
                  </sortable-header>
                  <th>Schedule</th>
                  <sortable-header
                    :sortBy="sortBy"
                    :header="{ value: 'latestExecution', label: 'Last'}"
                    @sort="onSorted">
                  </sortable-header>
                  <sortable-header
                    :sortBy="sortBy"
                    :header="{ value: 'nextExecution', label: 'Next'}"
                    @sort="onSorted">
                  </sortable-header>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cronjob in cronjobsFormatted" :key="cronjob.id">
                  <td>
                    <span class="badge p-15 lh-0 tt-c" :class="statusClass(cronjob.status)">
                      {{cronjob.status || 'None'}}
                    </span>
                  </td>
                  <td>{{cronjob.name}}</td>
                  <td>{{cronjob.schedule}}</td>
                  <td>
                    <template v-if="cronjob.latestExecution">
                      {{cronjob.latestExecution}}
                      <span class="badge p-10 lh-0 tt-c bgc-blue-50 c-blue-700">
                        ({{cronjob.executionTime || '-' }} sec)
                      </span>
                      <a href="" @click.prevent="getLog(cronjob)"
                        class="pL-10" v-show="!isRunning(cronjob.status)">
                        <font-awesome-icon :icon="faFileAlt" />
                      </a>
                    </template>
                    <template v-else >
                      No information
                    </template>
                  </td>
                  <td>{{cronjob.nextExecution}}</td>
                  <td>
                    <button type="submit" class="btn btn-primary btn-sm"
                      @click.prevent="run(cronjob)"
                      :disabled="isRunning(cronjob.status)">Run</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cronstrue from 'cronstrue'
import moment from 'moment'
import CronjobsService from '@/services/cronjobs'
import PodsService from '@/services/pods'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo'
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt'
import SortableHeader from '@/components/Table/SortableHeader'

const cronjobsService = CronjobsService()
const podsService = PodsService()

export default {
  data () {
    return {
      cronjobs: [],
      sortBy: {
        field: 'name',
        ascending: true,
      },
    }
  },
  created () {
    this.getCronjobs()
  },
  methods: {
    getRandom (threshold) {
      return Math.floor(Math.random() * threshold)
    },
    async getCronjobs () {
      if (this.environment)
        try {
          this.$Progress.start()
          this.cronjobs = await cronjobsService.find({
            environment: this.environment,
            sortBy: this.sortBy.field,
            sortDirection: this.sortBy.ascending ? 'asc' : 'desc',
          })
          this.$Progress.finish()
        } catch (err) {
          this.$notify({ type: 'error', text: err.message })
          this.$Progress.finish()
        }
    },
    statusClass (status) {
      if (status === 'Succeeded') return 'bgc-green-50 c-green-700'
      else if (this.isRunning(status) || !status) return 'bgc-orange-50 c-orange-700'
      return 'bgc-red-50 c-red-700'
    },
    isRunning (status) {
      return status === 'Running' || status === 'Pending'
    },
    formatDate (date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss')
    },
    duration (date1, date2) {
      return moment.duration(moment(date1).diff(moment(date2))).asSeconds()
    },
    async getLog (cronjob) {
      try {
        const logData = await podsService.getLog(cronjob.pod, this.environment, cronjob.namespace)

        const blob = new Blob([logData], { type: 'text/plain' })
        const link = document.createElement('a')

        const dateFormat = 'DDMMYYYY_HH_mm_ss'
        const dateFormatted = moment(cronjob.latestExecution, 'DD/MM/YYYY HH:mm:ss')
          .format(dateFormat)

        link.href = window.URL.createObjectURL(blob)
        link.target = '_blank'
        link.download = `${cronjob.name}_${dateFormatted}.log`

        link.click()
      } catch (err) {
        this.$notify({ type: 'error', text: err.message })
      }
    },
    async run (cronjob) {
      try {
        await cronjobsService.run(cronjob.name, this.environment, cronjob.namespace)
        this.$notify({
          type: 'success',
          text: 'The job has been scheduled. Please refresh the list after few seconds',
        })
      } catch (err) {
        this.$notify({ type: 'error', text: err.message })
      }
    },
    onSorted (field) {
      const ascending = field === this.sortBy.field ? !this.sortBy.ascending : false
      this.sortBy = { field, ascending }
      this.getCronjobs()
    },
  },
  computed: {
    cronjobsFormatted () {
      return this.cronjobs.map(cronjob => ({
        ...cronjob,
        status: cronjob.status,
        latestExecution: cronjob.latestExecution ? this.formatDate(cronjob.latestExecution) : null,
        executionTime: cronjob.completionTime
          ? this.duration(cronjob.completionTime, cronjob.latestExecution)
          : null,
        nextExecution: this.formatDate(cronjob.nextExecution),
        schedule: cronstrue.toString(cronjob.schedule),
      }))
    },
    faUndo () {
      return faUndo
    },
    faFileAlt () {
      return faFileAlt
    },
    ...mapState('general', ['environment']),
  },
  watch: {
    environment: 'getCronjobs',
  },
  components: {
    FontAwesomeIcon,
    SortableHeader,
  },
}
</script>
<style lang="scss" scoped>
.table > tbody > tr > td {
  vertical-align: middle;
}
.table > thead > tr > th {
  text-align: center;
}
</style>
