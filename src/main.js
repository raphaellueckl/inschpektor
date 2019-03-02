import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

Vue.config.productionTip = false;

library.add(faTrashAlt);
library.add(faWindowMinimize);
library.add(faWindowMaximize);
library.add(faCheck);
library.add(faExclamationTriangle);
library.add(faUpload);
library.add(faDownload);

Vue.component('font-awesome-icon', FontAwesomeIcon);

require('./assets/sass/main.scss');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
