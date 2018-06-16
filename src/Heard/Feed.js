import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { getUserQuery } from 'AWSTwitter/src/graphql/queries'
import uuidV4 from 'uuid/v4'
import moment from 'moment'

import Tweet from 'AWSTwitter/src/components/Tweet'

@inject('userStore')
@observer
export default class Search extends React.Component {
  async componentDidMount() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const { signInUserSession: { idToken: { payload: { sub }}}} = user
      const userInfo = await API.graphql(graphqlOperation(getUserQuery, { userId: sub }))
      this.props.userStore.updateUser(userInfo.data.getUser)
      this.props.userStore.updateUserLoading(false)
    } catch(err) {
      console.log('error!: ', err)
    }
  }
  render() {
    const { tweets, loadingUser } = this.props.userStore
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {
          loadingUser && (
            <View style={styles.loader}>
              <ActivityIndicator />
            </View>
          )
        }
        <View>
          {
            tweets.map((tweet, index) => (
              <Tweet
                text={tweet.tweetInfo.text}
                author={tweet.author.username}
                createdAt={moment(tweet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                key={uuidV4()}
              />
            ))
          }
        </View>
      </ScrollView>
    )
  }
}

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