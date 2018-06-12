import React from 'react'
import { Provider } from 'mobx-react'

import UIStore from './UIStore'
import UserStore from './UserStore'

const uiStore = new UIStore()
const userStore = new UserStore()

const stores = {
  uiStore,
  userStore
}

export default class MobXProvider extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        {this.props.children}
      </Provider>
    )
  }
}