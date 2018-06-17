import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated
} from 'react-native'

import {
  Auth, API, graphqlOperation
} from 'aws-amplify'
import { inject } from 'mobx-react'
import { basicUserQuery } from 'AWSTwitter/src/graphql/queries'

import { colors } from 'AWSTwitter/src/theme'
import { logo } from 'AWSTwitter/src/assets/images'

@inject('userStore')
export default class extends React.Component {
  animatedValue = new Animated.Value(0)
  async componentDidMount() {
    this.animate()
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      const { signInUserSession: { accessToken: { payload: { sub, username }}}} = currentUser
      let authenticatedUser = await API.graphql(graphqlOperation(basicUserQuery, { userId: sub }))
      this.props.userStore.updateUser(authenticatedUser.data.getUser)
 
      setTimeout(() => {
        console.log('about to navigate!!')
        console.log('authenticatedUser.data.getUser.userId: ', authenticatedUser.data.getUser.userId)
        this.props.navigation.navigate('Heard', { userId: '12345' })
      }, 350)
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