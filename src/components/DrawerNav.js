import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'

import { logo } from 'AWSTwitter/src/assets/images'
import { fonts } from 'AWSTwitter/src/theme'

export default class DrawerNav extends React.Component {
 render() {
    return (
      <View style={styles.container}>
        <View style={styles.linkContainer}>
          <View style={styles.link}>
            <Image style={styles.icon} source={logo} />
            <Text style={styles.title}>Log Out</Text>
          </View>
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