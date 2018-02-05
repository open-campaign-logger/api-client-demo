<template>
  <div>
     
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <h6 class="card-subtitle mb-2 text-muted"> Showing Log with ID: {{logId}}</h6>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DetailView',
  computed: {
    logId () {
      return this.$store.state.logDetail
    },
  },
  mounted () {
    var self = this
    axios.get('https://campaign-logger.com/gateway/rest/public/log/' + this.logId + "/entry", {
      headers: {
        'CL-Username': this.$store.state.user,
        'CL-Password': this.$store.state.password
      }
    })
      .then(response => {
          console.log(response.data)
      })
      .catch(error => {
          console.log(error)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
