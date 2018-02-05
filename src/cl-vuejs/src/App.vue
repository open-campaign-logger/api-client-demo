<template>
  <div>
    <gui-navbar></gui-navbar>
    <gui-content id="app"></gui-content>
  </div>
</template>

<script>
import Navbar from '@/components/GUI/Navbar'
import Content from '@/components/GUI/Content'
import store from './store'

export default {
  name: 'App',
  store,
  components: {
    'gui-navbar': Navbar,
    'gui-content': Content
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
