import { createSwitchNavigator } from 'react-navigation'

import Initializing from './components/Initializing'
import Auth from './Auth/Auth'
import Heard from './Heard/Heard'

export default createSwitchNavigator({
  Initializing: { screen: Initializing },
  Auth: { screen: Auth },
  Heard: { screen: Heard },
})
