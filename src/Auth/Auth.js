import React from 'react'

import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'

import SignUp from './SignUp'
import SignIn from './SignIn'
import { colors } from 'AWSTwitter/src/theme'

console.log('colors: ', colors)

const logo = require('AWSTwitter/src/assets/logo.png')
const signup = require('AWSTwitter/src/assets/signup.png')

const Tabs = {
  SignIn: {
    screen: SignIn,
    navigationOptions: () => ({
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={logo}
          style={{ width: 28, height: 28, tintColor }}
        />
      )
    })
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: () => ({
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={signup}
          style={{ width: 28, height: 28, tintColor }}
        />
      )
    })
  }
}

const config = {
  initialRouteName: 'SignUp',
  tabBarOptions: {
    activeTintColor: colors.primary,
    style: {
      backgroundColor: '#fafafa',
      borderTopWidth: 0
    }
  }
}

const AuthNav = createBottomTabNavigator(Tabs, config)

export default AuthNav