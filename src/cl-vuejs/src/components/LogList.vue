<template>
  <div class="hello  d-flex justify-content-around">
    <ul class="nav flex-column" >
      <li class="nav-item" v-for="log in logs" v-bind:key="log.id">
        <a class="nav-link" href="#" @click="changeDetailView(log.id)">{{log.name}}</a>
      </li>
    </ul>

    <div class="card flex-column" style="width: 80%;">
      <detail-view></detail-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DetailView from '@/components/DetailView'

export default {
  name: 'LogList',
  computed: {
    user () {
      return this.$store.state.user
    },
    logs () {
      return this.$store.state.campaignLogs
    }
  },
  components: {
    'detail-view': DetailView,
  },
  methods: {
    changeDetailView (id) {
      this.$store.commit("changeDetail", id)
    }
  },
  mounted () {
    var self = this
    axios.get('https://campaign-logger.com/gateway/rest/public/log', {
      headers: {
        'CL-Username': this.$store.state.user,
        'CL-Password': this.$store.state.password
      }
    })
      .then(response => {
        console.log(response.data)
        self.$store.commit('fillLogs', response.data)
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
