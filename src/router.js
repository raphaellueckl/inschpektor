import Vue from 'vue'
import Router from 'vue-router'
import About from './components/About.vue'
import HelloWorld from './components/Manage.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/manage',
      name: 'manage',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
