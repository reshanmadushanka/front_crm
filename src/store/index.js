import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUserData (state, userData) {
      state.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', `Bearer ${userData.access_token}`)
      axios.defaults.headers.common.Authorization = `Bearer ${userData.access_token}`
    },

    clearUserData () {
      localStorage.removeItem('user')
      location.reload()
    }
  },
  actions: {
    login ({ commit }, credentials) {
      return axios
        .post('http://abc_api.test/api/login', credentials)
        .then(({ data }) => {
          commit('setUserData', data)
        })
    },

    logout ({ commit }) {
      commit('clearUserData')
    }
  },
  getters: {
    isLogged: (state) => !!state.user
  },
  modules: {}
})
