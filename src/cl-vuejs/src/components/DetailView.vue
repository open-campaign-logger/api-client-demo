<template>
  <div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="entry in entries" v-bind:key="entry.id">
            <div v-html="entry.htmlText"></div>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailView',
  computed: {
    logId () {
      return this.$store.state.logDetail
    },
    entries () {
      return this.$store.state.logEntries
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
