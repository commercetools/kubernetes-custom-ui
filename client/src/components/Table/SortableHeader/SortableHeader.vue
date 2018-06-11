<template>
  <th class="sortable-header" :class="header.classes" @click.prevent="sort(header.value)">
    {{header.label}}
    <font-awesome-icon v-show="header.value === sortBy.field" :icon="getIcon(sortBy.ascending)" />
  </th>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSortUp from '@fortawesome/fontawesome-free-solid/faSortUp'
import faSortDown from '@fortawesome/fontawesome-free-solid/faSortDown'

export default {
  props: {
    header: {
      type: Object,
      required: true,
    },
    sortBy: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {}
  },
  methods: {
    getIcon (isAscending) {
      return isAscending ? faSortUp : faSortDown
    },
    sort (value) {
      this.$emit('sort', value)
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
<style lang="scss" scoped>
th {
  cursor: pointer;
}
</style>
