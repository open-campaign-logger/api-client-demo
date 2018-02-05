import Vue from 'vue'
import Router from 'vue-router'
import User from '@/components/User'
import LogList from '@/components/LogList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LogList',
      component: LogList
    },
    {
      path: '/user',
      name: 'User',
      component: User
    }
  ]
})
