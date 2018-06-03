import Vue from 'vue'
import Router from 'vue-router'
import About from './components/About.vue'
import Manage from './components/Manage.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import NotFound from './components/NotFound.vue'

Vue.use(Router);

const router = new Router({
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
      component: Manage,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (!token && to.path !== '/login') next('/login');
        else next();
      }
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
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default router;