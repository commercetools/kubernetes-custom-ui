<template>
  <div class="cronjobs">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="bgc-white bd bdrs-3 p-20 mB-20">
            <span class="float-right">*Times are 24-hour clock in {{timezone}} timezone</span>
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
                    :header="{ value: 'latestExecution', label: 'Last start time'}"
                    @sort="onSorted">
                  </sortable-header>
                  <sortable-header
                    :sortBy="sortBy"
                    :header="{ value: 'completionTime', label: 'Last end time'}"
                    @sort="onSorted">
                  </sortable-header>
                  <sortable-header
                    :sortBy="sortBy"
                    :header="{
                      value: 'executionTime', label: 'Last total execution time'}"
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
                  <td>{{cronjob.latestExecutionStart}}</td>
                  <td>
                    {{cronjob.latestExecutionEnd}}
                    <a href="" @click.prevent="getLog(cronjob)"
                      class="pL-10" v-if="cronjob.latestExecutionStart
                        && !isRunning(cronjob.status)">
                      <font-awesome-icon :icon="faFileAlt" />
                    </a>
                  </td>
                  <td>
                    <span v-show="cronjob.executionTime"
                      class="badge p-10 lh-0 bgc-blue-50 c-blue-700">
                      {{preciseDuration(cronjob.executionTime)}}
                    </span>
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
      if (date) return moment(date).format('DD/MM/YYYY HH:mm:ss')
      return ''
    },
    preciseDuration (seconds) {
      if (seconds) {
        const SECONDS_PER_HOUR = 3600
        const SECONDS_PER_MINUTE = 60
        const numhours = Math.floor(seconds / SECONDS_PER_HOUR)
        const numminutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
        const numseconds = (seconds % SECONDS_PER_HOUR) % SECONDS_PER_MINUTE

        const numHoursString = numhours ? `${numhours} h` : ''
        const numMinutesString = numminutes ? `${numminutes} m` : ''

        return `${numHoursString} ${numMinutesString} ${numseconds} s`
      }

      return ''
    },
    getTimezoneSchedule (schedule) {
      const scheduleParts = schedule.split(' ')
      const hours = scheduleParts[1].split(',')

      // timezone offset is in minutes
      /* eslint-disable no-restricted-globals */
      const hoursToTimezone = hours
        .map((h) => {
          if (!isNaN(h)) {
            const hour = parseInt(h, 10)
            const localHour = hour - (new Date().getTimezoneOffset() / 60)

            if (localHour < 0)
              return 24 + localHour
            else if (localHour > 24)
              return localHour - 24
            return localHour
          }

          return null
        })
        .filter(Boolean)

      if (hoursToTimezone.length)
        scheduleParts[1] = hoursToTimezone.join(',')

      return scheduleParts.join(' ')
    },
    getSchedule (cronjob) {
      return cronjob.runOnDemandOnly ? 'Not scheduled' :
        cronstrue.toString(
          this.getTimezoneSchedule(cronjob.schedule),
          { use24HourTimeFormat: true },
        )
    },
    getNextExecution (cronjob) {
      return cronjob.runOnDemandOnly ? '' :
        this.formatDate(cronjob.nextExecution)
    },
    async getLog (cronjob) {
      try {
        const logData = await podsService.getLog(cronjob.pod, this.environment, cronjob.namespace)

        const blob = new Blob([logData], { type: 'text/plain' })
        const link = document.createElement('a')

        const dateFormat = 'DD_MM_YYYY_HH_mm_ss'
        const dateFormatted = moment(cronjob.latestExecution).format(dateFormat)

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
        latestExecutionStart: this.formatDate(cronjob.latestExecution),
        latestExecutionEnd: this.formatDate(cronjob.completionTime),
        nextExecution: this.getNextExecution(cronjob),
        schedule: this.getSchedule(cronjob),
      }))
    },
    faUndo () {
      return faUndo
    },
    faFileAlt () {
      return faFileAlt
    },
    timezone () {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
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

