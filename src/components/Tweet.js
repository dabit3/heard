import React from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import { fonts } from 'AWSTwitter/src/theme'

class Tweet extends React.PureComponent {
  render() {
    const { author, text, createdAt } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.topContentContainer}>
          <Text style={styles.tweetAuthor}>{author}</Text>
          <Text style={styles.tweetTime}>{createdAt}</Text>
        </View>
        <Text style={styles.tweetText}>{text}</Text>
      </View>
    )
  }
}

export default Tweet

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1
  },
  tweetAuthor: {
    fontFamily: fonts.bold
  },
  tweetText: {
    fontFamily: fonts.normal
  },
  tweetTime: {
    color: 'rgba(0, 0, 0, .5)',
    fontSize: 14,
    fontFamily: fonts.light,
    marginLeft: 6
  },
  topContentContainer: {
    paddingBottom: 4,
    flexDirection: 'row'
  }
})
