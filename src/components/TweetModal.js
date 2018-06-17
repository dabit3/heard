import React from 'react'
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TextInput
} from 'react-native'

import { inject, observer } from 'mobx-react'
import { createTweet } from 'AWSTwitter/src/graphql/mutations'
import { getUserQuery } from 'AWSTwitter/src/graphql/queries'
import { graphql, compose } from 'react-apollo'
import TweetButton from 'AWSTwitter/src/components/TweetButton'

import { close, logo } from 'AWSTwitter/src/assets/images'
import { colors, fonts } from 'AWSTwitter/src/theme'

@inject('uiStore', 'userStore')
@observer
class TweetModal extends React.Component {
  state = {
    tweetText: ''
  }
  toggleModal = () => {
    this.props.uiStore.toggleTweetModal()
  }
  onChangeText = (tweetText) => {
    this.setState({ tweetText })
  }
  onAdd = () => {
    if (!this.state.tweetText) return
    const { userId } = this.props.userStore.user
    const tweet = {
      authorId: userId,
      text: this.state.tweetText
    }
    this.props.onAdd(tweet)
    this.setState({ tweetText: '' }, () => {
      this.props.uiStore.toggleTweetModal()
    })
  }
  render() {
    const { showTweetModal } = this.props.uiStore
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showTweetModal}
        onRequestClose={() => console.log('modal closed')}>
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableWithoutFeedback onPress={() => this.props.uiStore.toggleTweetModal()}>
              <Image
                source={close}
                style={styles.closeIcon}
              />
            </TouchableWithoutFeedback>
            <TweetButton onPress={this.onAdd} />
          </View>

          <View style={styles.createTweetContainer}>
            <View>
              <View style={styles.userIconContainer}>
                <Image
                  source={logo}
                  style={styles.userIcon}
                />
              </View>
            </View>
            <TextInput
              onChangeText={val => this.onChangeText(val)}
              style={styles.input}
              multiline={true}
              autoCorrect={false}
              placeholder="What's happening?"
            />
          </View>
        </View>
      </Modal>
    )
  }
}

export default compose(
  graphql(createTweet, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: props => ({
      onAdd: tweet  => {
        props.mutate({
          variables: tweet,
          optimisticResponse: {
            __typename: 'Mutation',
            createTweet: {
              __typename: 'Tweet',
              authorId: tweet.authorId,
              tweetInfo: {
                __typename: 'TweetText',
                text: tweet.text
              }
            }
          },
          update: (store, { data: { createTweet } }) => {
            const data = store.readQuery({ query: getUserQuery, variables: { userId: tweet.authorId } })
            const updatedTweet = {
              ...createTweet,
              author: {
                username: data.getUser.username,
                __typename: 'Author'
              },
              tweetId: null,
              createdAt: new Date()
            }

            data.getUser.tweets.items.unshift(updatedTweet)
            store.writeQuery({ query: getUserQuery, data, variables: { userId: tweet.authorId } })
          },
        })
      }
    }),
  })
)(TweetModal)

const styles = StyleSheet.create({
  header: {
    padding: 15,
    paddingTop: 25
  },
  userIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  userIcon: {
    height: 22,
    width: 22,
    tintColor: 'white'
  },
  closeIcon: {
    tintColor: colors.primary,
    width: 30,
    height: 30,
    padding: 10
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  createTweetContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row'
  },
  input: {
    height: '100%',
    width: '90%',
    paddingTop: 10,
    fontSize: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    fontFamily: fonts.regular
  }
})