import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

export default class extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Scream')
    }, 4000)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello from Initializing</Text>
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