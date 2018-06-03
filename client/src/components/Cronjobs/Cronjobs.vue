<template>
  <div class="cronjobs">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="bgc-white bd bdrs-3 p-20 mB-20">
            <h4 class="c-grey-900 mB-20">Cronjobs</h4>
            <table id="dataTable" class="table table-bordered table-responsive-sm" cellspacing="0" width="100%">
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
                <tr v-for="cronjob in cronjobs" :key="cronjob.id">
                  <td>{{cronjob.status}}</td>
                  <td>{{cronjob.name}}</td>
                  <td>{{cronjob.schedule}}</td>
                  <td>{{cronjob.last}}</td>
                  <td>{{cronjob.next}}</td>
                  <td></td>
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
export default {
  data() {
    return {
      cronjobs: [],
      statuses: ['Running', 'Error', 'Completed'],
      schedules: ['Every 1h', 'Every 30min', 'Every 24h'],
    }
  },
  created() {
    for (let index = 0; index < 20; index++) {
      this.cronjobs.push({
        status: this.statuses[this.getRandom(3)],
        name: `cronjob name ${index}`,
        schedule: this.schedules[this.getRandom(3)],
        last: new Date().toISOString(),
        next: new Date().toISOString(),
      })
    }
  },
  methods: {
    getRandom(threshold) {
      return Math.floor(Math.random() * threshold)
    },
  },
}
</script>

<style>
</style>
