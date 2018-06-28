import React from 'react'
import { AppRegistry } from 'react-native';
import App from 'AWSTwitter/App';
import Provider from 'AWSTwitter/src/mobx'
import Amplify, { Auth} from 'aws-amplify'
import AWSAppSyncClient from 'aws-appsync'
import config from './src/aws-exports'
import { ApolloProvider } from 'react-apollo'

const client = new AWSAppSyncClient({
  url: 'https://dp7aen2zanczzmilqjhoucvmjy.appsync-api.us-east-1.amazonaws.com/graphql',
  region: 'us-east-1',
  auth: {
    type: 'AMAZON_COGNITO_USER_POOLS',
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  }
})

Amplify.configure(config)

const AppWithData = () => (
  <Provider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
)

console.ignoredYellowBox = ['Warning', 'Remote']

AppRegistry.registerComponent('AWSTwitter', () => AppWithData);
