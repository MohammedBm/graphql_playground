import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client' //Apollo-client dosent know that we are using it with react so to make it compatible we need to add 
import { ApolloProvider } from 'react-apollo' // this package which will add support react to apollo-clinet
import SongList from './components/SongList'

const client = new ApolloClient({})

const Root = () => {
  return (
  <ApolloProvider client={client}>
    <SongList />
  </ApolloProvider>
  )
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
