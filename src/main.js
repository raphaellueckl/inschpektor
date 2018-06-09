import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import fontawesome from '@fortawesome/fontawesome'
import faTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt'

fontawesome.library.add(faTrashAlt)

require('./assets/sass/main.scss');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
