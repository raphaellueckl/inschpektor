import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import fontawesome from '@fortawesome/fontawesome';
import farTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import farWindowMaximize from '@fortawesome/fontawesome-free-regular/faWindowMaximize';
import fasFaCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import fasFaExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';
import fasWindowMinimize from '@fortawesome/fontawesome-free-solid/faWindowMinimize';

fontawesome.library.add(farTrashAlt);
fontawesome.library.add(fasWindowMinimize);
fontawesome.library.add(farWindowMaximize);
fontawesome.library.add(fasFaCheck);
fontawesome.library.add(fasFaExclamationTriangle);

require('./assets/sass/main.scss');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
