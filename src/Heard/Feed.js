import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native'
import { inject, observer } from 'mobx-react'

@inject('userStore')
@observer
export default class Search extends React.Component {
  render() {
    console.log('props from feed: ', this.props)
    return (
      <View>
        <Text>Hello from Feed</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})