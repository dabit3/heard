import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native'

import { colors, fonts } from 'AWSTwitter/src/theme'

class TweetButton extends React.Component {
  render() {
    return (
      <View style={styles.absoluteContainer}>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={styles.container}>
            <Text style={styles.text}>Tweet</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    width: 100,
    right: 15,
    top: 30
  },
  container: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: fonts.medium,
    color: 'white'
  }
})

export default TweetButton