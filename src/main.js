import Vue from 'vue'
import apolloProvider from './apollo'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'
import "vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false

new Vue({
  vuetify,
  el: '#app',
  apolloProvider,
  render: h => h(App),
  router,
  store,
  template: '<App/>',
}).$mount('#app');
