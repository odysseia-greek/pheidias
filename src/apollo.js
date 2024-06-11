import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { provideApolloClient } from '@vue/apollo-composable';
import {IntrospectionFragmentMatcher} from "apollo-boost";
import fragmentTypes from '@/constants/fragments.json';


const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: fragmentTypes
});

const inMemoryCache = new InMemoryCache({ fragmentMatcher });

// Define the URL for the GraphQL server
let url = document.location.origin + '/graphql';
if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:8080/graphql';
}

if (process.env.NODE_ENV === 'k3d') {
    url = 'http://k3d-odysseia.greek:8080/graphql';
}

// Create the HTTP link for the Apollo client
const httpLink = new HttpLink({
    uri: url,
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
});

// Create the Apollo client
export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: inMemoryCache,
    connectToDevTools: true,
});

// Create the Apollo provider
const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
});

// Install the Vue Apollo plugin
Vue.use(VueApollo);

// Provide the Apollo client for use with the Composition API
provideApolloClient(apolloClient);

export default apolloProvider;
