import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client/core';

let url = document.location.origin + '/graphql';
if (process.env.NODE_ENV === 'development') {
    url = "http://localhost:8080/graphql";
}

if (process.env.NODE_ENV === 'k3s') {
    url = "http://k3s-odysseia.greek:8080/graphql";
}

const httpLink = createHttpLink({
    uri: url,
});

const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})

export default apolloClient;
