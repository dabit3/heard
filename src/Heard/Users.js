import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { listUsers, listFollowingQuery, getUserQuery } from 'AWSTwitter/src/graphql/queries'
import { createFollowing } from 'AWSTwitter/src/graphql/mutations'
import { graphql, compose } from 'react-apollo'
import { fonts, colors } from 'AWSTwitter/src/theme'
import { inject } from 'mobx-react'
import uuidV4 from 'uuid/v4'

@inject('userStore')
class Users extends React.Component {
  createFollowing = (followerId, followingId) => {
    this.props.createFollowing({ followerId, followingId })
  }
  render() {
    const { userId } = this.props.userStore.user
    const { followingMap } = this.props
    return (
        <ScrollView>
          <View>
            {
            this.props.users.map((user, index) => {
              const Component = followingMap[user.userId] ? View : TouchableOpacity
              const backgroundColor = followingMap[user.userId] ? 'transparent' : colors.primary
              const color = followingMap[user.userId] ? 'black' : 'white'
              return (
                <View key={index} style={styles.userInfo}>
                  <Text style={styles.text}>{user.username}</Text>
                  <Component onPress={() => this.createFollowing(userId, user.userId)}>
                    <View style={[styles.followComponent, { backgroundColor }]}>
                      <Text style={{ color }}>{followingMap[user.userId] ? 'Following' : 'Follow'}</Text>
                    </View>
                  </Component>
                </View>
              )
            })
          }
          </View>
        </ScrollView>
    )
  }
}

export default compose(
  graphql(createFollowing, {
    props: props => ({
      createFollowing: ids => {
        props.mutate({
          refetchQueries: [{
            query: getUserQuery,
            variables: { userId: props.ownProps.screenProps.userId },
          }],
          variables: ids,
          update: (store, { data: { createFollowing } }) => {
            createFollowing = {
              ...createFollowing,
              ...ids
            }
            const data = store.readQuery({ query: listFollowingQuery })
            data.listFollowing.push(createFollowing)
            store.writeQuery({ query: listFollowingQuery, data })
          },
          optimisticResponse: {
            __typename: 'CreateFollowingMutation',
            createFollowing: {
              __typename: 'CreateFollowing',
              ...ids,
              id: uuidV4()
            }
          },
        })
      }
    })
  }),
  graphql(getUserQuery, {
    options: data => ({
      fetchPolicy: 'cach-and-network',
      variables: { userId: data.screenProps.userId },
    }),
  }),
  graphql(listFollowingQuery, {
    options: {
      fetchPolicy: 'cach-and-network',
    },
    props: props => {
      const followingMap = props.data.listFollowing ? props.data.listFollowing.reduce((acc, next) => {
        acc[next.followingId] = next.followingId
        return acc
      }, {}) : {}
      return {
        followingInfo: props.data.listFollowing,
        followingMap
      }
    }
  }),
  graphql(listUsers, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: props => {
      const { userId } = props.ownProps.screenProps
      return {
        users: props.data.listUsers ? props.data.listUsers.items.filter(item => item.userId !== userId) : []
      }
    }
  })
)(Users)

const styles = StyleSheet.create({
  followComponent: {
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  userInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    flexDirection: 'row'
  },
  text: {
    fontFamily: fonts.regular,
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})