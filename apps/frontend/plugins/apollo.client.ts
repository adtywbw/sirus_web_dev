import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const httpLink = createHttpLink({ uri: config.public.graphqlEndpoint, fetch: fetch as any });

  const authLink = setContext((_, { headers }) => {
    const token = process.client ? localStorage.getItem('token') : null;
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return {
    provide: {
      apollo: apolloClient
    }
  };
});
