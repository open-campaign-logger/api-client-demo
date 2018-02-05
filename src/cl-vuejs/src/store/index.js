import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: '',
    password: '',
    showUserForms: true,
    campaignLogs: [],
    logEntries: [],
    logDetail: ''
  },
  mutations: {
    saveUser (state, n) {
      state.user = n.username
      state.password = n.password
    },
    fillLogs (state, n) {
      state.campaignLogs = n
    },
    changeDetail (state, id) {
      state.logDetail = id
    }
  },
  actions: {}
})

export default store
