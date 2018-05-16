import React from 'react'
import { Provider } from 'mobx-react'

import UIStore from './UIStore'

const uiStore = new UIStore()

const stores = {
  uiStore
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