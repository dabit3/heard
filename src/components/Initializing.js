import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated
} from 'react-native'

import {
  Auth
} from 'aws-amplify'

import { colors } from 'AWSTwitter/src/theme'
import { logo } from 'AWSTwitter/src/assets/images'

export default class extends React.Component {
  animatedValue = new Animated.Value(0)
  async componentDidMount() {
    this.animate()
    try {
      const user = await Auth.currentAuthenticatedUser()
      setTimeout(() => {
        this.props.navigation.navigate('Heard')
      }, 1000)
    } catch (err) {
      console.log('err:', err)
      this.props.navigation.navigate('Auth')
    }
  }
  animate() {
    const animation  = Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2000
      }
    )
    animation.start(() => this.animate())
  }
  render() {
    const scale = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [.7, 1]
    })
    return (
      <View style={styles.container}>
        <Animated.Image
          source={logo}
          style={[styles.image, { transform: [{ scale: scale }] }]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    tintColor: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  }
})