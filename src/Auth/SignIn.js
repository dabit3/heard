import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Image
} from 'react-native'

import { fonts } from 'AWSTwitter/src/theme'
import { logo, logoTitle } from 'AWSTwitter/src/assets/images'
import Block from 'AWSTwitter/src/components/ColorBlock'
import Button from 'AWSTwitter/src/components/BlueButton'

export default class extends React.Component {
  signIn = () => {
    console.log('sign in pressed')
  }
  render() {
    return (
      <View style={styles.container}>
        <Block style={{ transform: [{ rotate: '-45deg' }] }} />
        <View style={styles.titleContainer}>
          <Image
            style={styles.logo}
            source={logo}
          />
          <Image
            style={styles.logoTitle}
            source={logoTitle}
            resizeMode='contain'
          />
        </View>
        <TextInput
          placeholder='Username'
          style={styles.input}
        />
        <TextInput
          placeholder='Password'
          secureTextEntry={true}
          style={styles.input}
        />
        <Button title='Sign In' onPress={this.signIn} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 39,
    height: 39,
    tintColor: 'white'
  },
  titleContainer: {
    flexDirection: 'row'
  },
  logoTitle: {
    tintColor: 'white',
    height: 42,
    width: 110
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    fontFamily: fonts.regular,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 8
      }
    })
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  title: {
    fontFamily: fonts.italic
  }
})