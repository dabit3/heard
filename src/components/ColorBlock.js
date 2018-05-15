import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import { colors } from 'AWSTwitter/src/theme'

export default ({ style }) => <View style={[styles.container, style]} />

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -300,
    right: -300,
    width: 1200,
    height: 600,
    backgroundColor: colors.primary,
    transform: [{ rotate: '30deg' }]
  }
})
