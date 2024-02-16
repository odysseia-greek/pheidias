import {createApp, h, provide} from 'vue';
import App from '@/App.vue';
import router from './router'; // Updated router import
import store from './store'; // Updated store import
import vuetify from '@/plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'; // Ensure the Vuetify styles are imported
import apolloClient from './apollo'; // Ensure your Apollo client is exported correctly from './apollo'
import { DefaultApolloClient } from '@vue/apollo-composable';


// Setup Apollo Client
const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient);
    },

    render: () => h(App),
});

app.use(vuetify)
// Use Vue Router
app.use(router);

// Use Vuex Store
app.use(store);

// Mount Vue application
app.mount('#app');
