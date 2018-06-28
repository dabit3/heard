import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { getUserQuery } from 'AWSTwitter/src/graphql/queries'
import uuidV4 from 'uuid/v4'
import moment from 'moment'
import { graphql, compose, withApollo } from 'react-apollo'

import Tweet from 'AWSTwitter/src/components/Tweet'

@inject('userStore')
@observer
class Feed extends React.Component {
  render() {
    const { loading, messages } = this.props
    return (
      <ScrollView contentContainerStyle={loading && { flex: 1 }}>
        {
          loading && (
            <View style={styles.loader}>
              <ActivityIndicator />
            </View>
          )
        }
        <View>
          {
            !loading && messages.map((message, index) => (
              <Tweet
                text={message.messageInfo.text}
                author={message.author.username}
                createdAt={moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                key={uuidV4()}
              />
            ))
          }
        </View>
      </ScrollView>
    )
  }
}

export default compose(
  graphql(
    getUserQuery, {
      options: data => ({
        fetchPolicy: 'cache-and-network',
        variables: { userId: data.screenProps.userId }
      }),
      props: props => {
        const { loading, getUser } = props.data
        let messages = []
        messages = getUser && getUser.following.items ? getUser.following.items.reduce((acc, next) => {
          if (!next) return acc
          if (getUser.userId === next.userId) return acc
          acc.push(...next.messages.items)
          return acc
        }, []) : []
        if (getUser) {
          messages.push(...getUser.messages.items)
        }
        messages.sort(function (a, b) {
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          return dateA - dateB;
        })
        .reverse()

        return {
          user: getUser,
          loading,
          messages
        }
      }
    }
  )
)(Feed)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})