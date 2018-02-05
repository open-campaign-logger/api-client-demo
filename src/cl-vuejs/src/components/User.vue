<template>
  <div class="hello">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">Username</span>
      </div>
      <input v-model="username" type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
    </div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" >Password</span>
      </div>
      <input v-model="password" type="password" class="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1">
    </div>
    <button type="button" class="btn btn-outline-dark btn-block" @click="saveUser">Save User Data</button>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    saveUser: function () {
      let user = {username: this.username, password: this.password}
      this.$store.commit('saveUser', user)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
