import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import vuetify from './plugins/vuetify';
import apolloProvider from './apollo'; // Adjust the path as needed
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

createApp(App)
    .use(router)
    .use(pinia)
    .use(vuetify)
    .use(apolloProvider)
    .mount('#app');
