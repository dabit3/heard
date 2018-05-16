import React from 'react'
import { AppRegistry } from 'react-native';
import App from 'AWSTwitter/App';
import Provider from 'AWSTwitter/src/mobx'
import Amplify from 'aws-amplify'
import config from './src/aws-exports'
Amplify.configure(config)

const AppWithData = () => (
  <Provider>
    <App />
  </Provider>
)

console.ignoredYellowBox = ['Warning', 'Remote']

AppRegistry.registerComponent('AWSTwitter', () => AppWithData);
