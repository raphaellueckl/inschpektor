import Vue from 'vue';
import Router from 'vue-router';
import About from './components/about/About.vue';
import Manage from './components/manage/Manage.vue';
import Dashboard from './components/dashboard/Dashboard.vue';
import Login from './components/Login.vue';
import NodeInfo from './components/nodeinfo/NodeInfo.vue';
import NotFound from './components/NotFound.vue';

Vue.use(Router);

const loginNecessary = (to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token && to.path !== '/login') next('/login');
  else next();
};

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
      beforeEnter: loginNecessary
    },
    {
      path: '/node',
      name: 'node-info',
      component: NodeInfo,
      beforeEnter: loginNecessary
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
});

export default router;