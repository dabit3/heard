import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import { inject, observer } from 'mobx-react'

import { Auth } from 'aws-amplify'
import { logo } from 'AWSTwitter/src/assets/images'
import { fonts } from 'AWSTwitter/src/theme'

@inject('userStore')
@observer
export default class DrawerNav extends React.Component {
  logout = async () => {
    try {
      await Auth.signOut()
      this.props.navigation.navigate('Auth')
    } catch (err) {
      console.log('error logging out..', err)
    }
  }
  render() {
    console.log('props:', this.props)
      return (
        <View style={styles.container}>
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={this.logout}>
              <View style={styles.link}>
                <Image style={styles.icon} source={logo} />
                <Text style={styles.title}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    } 
}

const styles = StyleSheet.create({
  linkContainer: {
    paddingTop: 20
  },
  container: {
    padding: 20
  },
  link: {
    flexDirection: 'row'
  },
  icon: {
    tintColor: 'rgba(0, 0, 0, .4)',
    width: 26,
    height: 26,
    marginRight: 12
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: 18,
    color: 'rgba(0, 0, 0, .8)',
    marginTop: 1
  }
})