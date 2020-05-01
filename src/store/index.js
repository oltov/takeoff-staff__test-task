import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contacts: [],
    authToken: '',
    qwe: false,
    URL: 'http://localhost:3000/contacts',
    searchURL: 'http://localhost:3000/contacts?q='
  },
  getters: {
    getContacts(state) {
      return state.contacts
    },
    getToken(state) {
      return state.authToken
    }
  },
  mutations: {
    refreshContacts(state, data) {
      console.log(data)
      state.contacts = data
    },
    deleteContact(state, id) {
      const index = state.contacts.findIndex(item => item.id == id)
      state.contacts.splice(index, 1)
    },
    sendUserContact(state, data) {
      state.contacts.push(data)
    },
    setToken(state, token) {
      state.authToken = token
    },
    deleteToken(state) {
      state.authToken = ''
    },
  },
  actions: {
    authorizationRequest({ state, commit }, { login, password }) {
      return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
      })
      .then(response => response.json())
      .then(response => {
        if(response.status == 200) {
          commit('setToken', response.access_token)
          resolve()
        } else {
          reject(response)
        }
      })
      .catch(() => console.log('ошибка в запросе'))
      })
    },
    requestData({ state, commit }) {
      fetch(state.URL, {
        headers: {
          'Authorization': 'Bearer ' + state.authToken
        }
      })
      .then(resolve => resolve.json())
      .then(data => commit('refreshContacts', data))
      .catch(() => console.log('ошибка сервера'))
    },
    // экшен делает запрос на удаление с сервера и 
    // удаляет элемент из стора
    deleteData({ state, commit }, id) {
      fetch(state.URL + '/' + id, {
        headers: {
          'Authorization': 'Bearer ' + state.authToken
        },
        method: 'DELETE'
      })
      .catch(() => console.log('ошибка удаления'))
      commit('deleteContact', id)
    },
    // запрос на добавление контакта на сервер
    sendData({ state, commit }, data ){
      fetch(state.URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + state.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .catch(() => console.log('ошибка отправки данных'))
      commit('sendUserContact', data)
    },
    changeData({ state }, data) {
      fetch(state.URL + '/' + data.id, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + state.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .catch(() => console.log('ошибка добавления'))
    },
    searchContact({ state, commit }, value) {
      console.log(value)
      fetch(state.searchURL + value, {
        headers: {
          'Authorization': 'Bearer ' + state.authToken,
        },
      })
        .then(response => response.json())
        .then(data => commit('refreshContacts', data))
        .catch(() => console.log('ошибка поиска'))
    }
  },
  modules: {
  }
})
