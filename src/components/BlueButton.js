import React from 'react'
import {
  Text,
  View,
  Touch,
  StyleSheet,
  TouchableHighlight,
  Platform
} from 'react-native'

import { colors, fonts } from 'AWSTwitter/src/theme'

export default ({ buttonStyle, textStyle, title, onPress }) => (
  <TouchableHighlight onPress={onPress} underlayColor='transparent'>
    <View style={[styles.button, buttonStyle]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </View>
  </TouchableHighlight>
)

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 8
      }
    })
  },
  buttonText: {
    color: 'white',
    fontFamily: fonts.bold
  },
})