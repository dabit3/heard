import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  TextInput
} from 'react-native'

import { inject, observer } from 'mobx-react'
import  { createMessage } from 'AWSTwitter/src/graphql/mutations'
import { getUserQuery } from 'AWSTwitter/src/graphql/queries'
import { graphql, compose } from 'react-apollo'
import MessageButton from 'AWSTwitter/src/components/MessageButton'
import uuidV4 from 'uuid/v4'

import { close, logo } from 'AWSTwitter/src/assets/images'
import { colors, fonts } from 'AWSTwitter/src/theme'

const { width, height } = Dimensions.get('window')

@inject('uiStore', 'userStore')
@observer
class MessageModal extends React.Component {
  state = {
    messageText: ''
  }
  toggleModal = () => {
    this.props.uiStore.toggleMessageModal()
  }
  onChangeText = (messageText) => {
    this.setState({ messageText })
  }
  onAdd = () => {
    if (!this.state.messageText) return
    const { userId } = this.props.userStore.user
    const message = {
      authorId: userId,
      text: this.state.messageText
    }
    this.props.onAdd(message)
    this.setState({ messageText: '' }, () => {
      this.props.uiStore.toggleMessageModal()
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => this.props.uiStore.toggleMessageModal()}>
            <Image
              source={close}
              style={styles.closeIcon}
            />
          </TouchableWithoutFeedback>
          <MessageButton onPress={this.onAdd} />
        </View>

        <View style={styles.createMessageContainer}>
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
    )
  }
}

export default compose(
  graphql(createMessage, {
    props: props => ({
      onAdd: message  => {
        props.mutate({
          refetchQueries: [{
            query: getUserQuery,
            variables: { userId: message.authorId },
          }],
          variables: message,
          optimisticResponse: {
            __typename: 'Mutation',
            createMessage: {
              __typename: 'Message',
              authorId: message.authorId,
              messageInfo: {
                __typename: 'MessageInfo',
                text: message.text
              }
            }
          },
          update: (store, { data: { createMessage } }) => {
            const data = store.readQuery({ query: getUserQuery, variables: { userId: message.authorId } })

            const updatedMessage = {
              __typename: 'Message',
              messageInfo: {
                ...createMessage.messageInfo
              },
              author: {
                username: data.getUser.username,
                __typename: 'User'
              },
              messageId: uuidV4(),
              createdAt: new Date()
            }

            data.getUser.messages.items.unshift(updatedMessage)
            store.writeQuery({ query: getUserQuery, data, variables: { userId: message.authorId } })
          },
        })
      }
    }),
  })
)(MessageModal)

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
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'white'
  },
  createMessageContainer: {
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