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
import { Auth } from 'aws-amplify'

import Block from 'AWSTwitter/src/components/ColorBlock'
import Button from 'AWSTwitter/src/components/BlueButton'
import { colors, fonts } from 'AWSTwitter/src/theme'

import { logo, logoTitle } from 'AWSTwitter/src/assets/images'

export default class extends React.Component {
  state = {
    username: '',
    password: '',
    phone: '',
    email: '',
    authCode: '',
    showConfirmSignUp: false
  }
  signUp = async () => {
    const { username, password, email, phone } = this.state
    try {
      const user = {
        username,
        password,
        attributes: {
          phone_number: phone,
          email
        }
      }
      await Auth.signUp(user)
      console.log('successful sign up!')
      this.setState({ showConfirmSignUp: true })
    } catch (err) {
      console.log('error signing up: ', err)
    }
  }
  confirmSignUp = async () => {
    const { authCode, username } = this.state
    try {
      await Auth.confirmSignUp(username, authCode)
      console.log('successfully confirmed sign up!')
      this.props.navigation.navigate('SignIn')
    } catch (err) {
      console.log('error signing up: ', err)
    }
  }
  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }
  render() {
    const { showConfirmSignUp } = this.state
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
        {
          !showConfirmSignUp && (
            <View>
              <TextInput
                placeholder='Username'
                style={styles.input}
                onChangeText={val => this.onChangeText('username', val)}
                value={this.state.username}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TextInput
                placeholder='Email'
                style={styles.input}
                onChangeText={val => this.onChangeText('email', val)}
                value={this.state.email}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TextInput
                placeholder='Password'
                secureTextEntry={true}
                style={styles.input}
                onChangeText={val => this.onChangeText('password', val)}
                value={this.state.password}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder='Phone Number'
                onChangeText={val => this.onChangeText('phone', val)}
                value={this.state.phone}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <Button onPress={this.signUp} title="Sign Up" />
            </View>
          )
        }
        {
          showConfirmSignUp && (
            <View>
              <TextInput
                placeholder='Confirmation Code'
                style={styles.input}
                onChangeText={val => this.onChangeText('authCode', val)}
                value={this.state.authCode}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <Button onPress={this.confirmSignUp} title="Confirm Sign Up" />
            </View>
          )
        }
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