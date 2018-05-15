import React from 'react'

import { createSwitchNavigator } from 'react-navigation'

import Initializing from './components/Initializing'
import Auth from './Auth/Auth'
import Heard from './Heard/Heard'

const Nav = createSwitchNavigator({
  // Initializing: { screen: Initializing },
  Auth: { screen: Auth },
  Heard: { screen: Heard },
})

export default class extends React.Component {
  render() {
    return (
      <Nav />
    )
  }
}
