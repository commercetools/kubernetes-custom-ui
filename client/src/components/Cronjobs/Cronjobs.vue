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
                  <th>Status</th>
                  <th>Cronjob</th>
                  <th>Schedule</th>
                  <th>Last</th>
                  <th>Next</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cronjob in cronjobsFormatted" :key="cronjob.id">
                  <td>
                    <span class="badge p-15 lh-0 tt-c" :class="statusClass(cronjob.status)">
                      {{cronjob.status}}
                    </span>
                  </td>
                  <td>{{cronjob.name}}</td>
                  <td>{{cronjob.schedule}}</td>
                  <td>
                    {{cronjob.latestExecution}}
                    <span class="badge p-10 lh-0 tt-c bgc-blue-50 c-blue-700">
                      ({{cronjob.executionTime}} sec)
                    </span>
                    <a href="" @click.prevent="getLog(cronjob)"
                      class="pL-10" v-show="!isRunning(cronjob.status)">
                      <font-awesome-icon :icon="faFileAlt" />
                    </a>
                  </td>
                  <td>{{cronjob.next}}</td>
                  <td>
                    <button type="submit" class="btn btn-primary btn-sm"
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
import cronstrue from 'cronstrue'
import cronParser from 'cron-parser'
import moment from 'moment'
import CronjobsService from '@/services/cronjobs'
import PodsService from '@/services/pods'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo'
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt'

const cronjobsService = CronjobsService()
const podsService = PodsService()

export default {
  data () {
    return {
      cronjobs: [],
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
      try {
        this.$Progress.start()
        this.cronjobs = await cronjobsService.find()
        this.$Progress.finish()
      } catch (err) {
        console.log(err)
      }
    },
    statusClass (status) {
      if (status === 'Succeeded') return 'bgc-green-50 c-green-700'
      else if (this.isRunning(status)) return 'bgc-orange-50 c-orange-700'
      return 'bgc-red-50 c-red-700'
    },
    isRunning (status) {
      return status === 'Running' || status === 'Pending'
    },
    formatDate (date) {
      return date ? moment(date).format('DD/MM/YYYY HH:mm:ss') : '-'
    },
    duration (date1, date2) {
      return moment.duration(moment(date1).diff(moment(date2))).asSeconds()
    },
    async getLog (cronjob) {
      try {
        const logData = await podsService.getLog(cronjob.pod)

        const blob = new Blob([logData], { type: 'text/plain' })
        const link = document.createElement('a')

        const dateFormat = 'DDMMYYYY_HH_mm_ss'
        // prettier-ignore
        const dateFormatted = moment(cronjob.latestExecution, 'DD/MM/YYYY HH:mm:ss')
          .format(dateFormat)

        link.href = window.URL.createObjectURL(blob)
        link.target = '_blank'
        link.download = `${cronjob.name}_${dateFormatted}.log`

        link.click()
      } catch (err) {
        console.log(err)
      }
    },
  },
  computed: {
    cronjobsFormatted () {
      return this.cronjobs.map(cronjob => ({
        ...cronjob,
        latestExecution: this.formatDate(cronjob.latestExecution),
        executionTime: cronjob.completionTime
          ? this.duration(cronjob.completionTime, cronjob.latestExecution)
          : '-',
        // prettier-ignore
        next: this.formatDate(cronParser
          .parseExpression(cronjob.schedule)
          .next()
          .toString()),
        schedule: cronstrue.toString(cronjob.schedule),
      }))
    },
    faUndo () {
      return faUndo
    },
    faFileAlt () {
      return faFileAlt
    },
  },
  components: {
    FontAwesomeIcon,
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

