import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Login from '../views/Login.vue'
import Contacts from '../views/Contacts.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.getToken) {
    next('/login')
  }
  next()
})

export default router
