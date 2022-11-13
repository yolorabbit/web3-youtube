import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/thalesbmc/web3-youtube",
  cache: new InMemoryCache(),
});

export default client;
