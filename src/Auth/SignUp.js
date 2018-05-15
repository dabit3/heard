import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native'

import Block from 'AWSTwitter/src/components/ColorBlock'
import Button from 'AWSTwitter/src/components/BlueButton'
import { colors, fonts } from 'AWSTwitter/src/theme'

import { logo, logoTitle } from 'AWSTwitter/src/assets/images'

export default class extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Block />
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
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Username'
            style={styles.input}
          />
          <TextInput
            placeholder='Email'
            style={styles.input}
          />
          <TextInput
            placeholder='Password'
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            style={styles.input}
            placeholder='Phone Number'
          />
          <Button title="Sign Up" />
        </View>
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
    paddingHorizontal: 30,
    justifyContent: 'center',
  }
})