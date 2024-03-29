import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'


let url = document.location.origin + '/graphql'
if (process.env.NODE_ENV === 'development') {
    url = "http://localhost:8080/graphql"
}

if (process.env.NODE_ENV === 'k3s') {
    url = "http://k3s-odysseia.greek:8080/graphql"
}

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: url,
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
        "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
})

// Create the apollo client
export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

// Install the vue plugin
Vue.use(VueApollo)

export default apolloProvider
