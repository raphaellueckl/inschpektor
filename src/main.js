import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import fontawesome from '@fortawesome/fontawesome'
import farTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import fasWindowMinimize from '@fortawesome/fontawesome-free-solid/faWindowMinimize'
import farWindowMaximize from '@fortawesome/fontawesome-free-regular/faWindowMaximize'

fontawesome.library.add(farTrashAlt)
fontawesome.library.add(fasWindowMinimize)
fontawesome.library.add(farWindowMaximize)

require('./assets/sass/main.scss');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
