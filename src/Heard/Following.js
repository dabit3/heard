import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { getUserQuery, listFollowingQuery } from 'AWSTwitter/src/graphql/queries'
import { deleteFollowing } from 'AWSTwitter/src/graphql/mutations'
import { graphql, compose } from 'react-apollo'
import { fonts, colors } from 'AWSTwitter/src/theme'

@inject('userStore')
@observer
class Following extends React.Component {
  deleteFollowing = (id, userId) => {
    this.props.deleteFollowing({ id, userId })
  }
  render() {
    const items = this.props.following.map(item => {
      this.props.followingData.forEach(following => {
        if (!item) return
        if(item.userId === following.followingId) {
          item = {
            ...item,
            followingIdentifier: following.id
          }
        }
      })
      return item
    }) 
    return (
        <ScrollView>
          <View>
            {
              this.props.following && items.map((item, index) => (
              <View key={index} style={styles.userInfo}>
                <Text style={styles.text}>{item.username}</Text>
                <TouchableOpacity onPress={() => this.deleteFollowing(item.followingIdentifier, item.userId)}>
                  <View style={styles.unfollow}>
                    <Text style={styles.unfollowText}>Unfollow</Text>
                  </View>
                </TouchableOpacity>
              </View>
              ))
            }
          </View>
        </ScrollView>
    )
  }
}

export default compose(
  graphql(listFollowingQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: props => ({
      followingData: props.data.listFollowing
    })
  }),
  graphql(deleteFollowing, {
    options: {
      refetchQueries: [{ query: listFollowingQuery }]
    },
    props: props => ({
      deleteFollowing: ids => {
        props.mutate({
          variables: ids,
          update: (store, { data: { deleteFollowing } }) => {
            let data = store.readQuery({ query: getUserQuery, variables: { userId: props.ownProps.screenProps.userId } })
            data.getUser.following.items = data.getUser.following.items.filter(item => {
              return item.userId !== deleteFollowing.followingId
            })

            store.writeQuery({ query: getUserQuery, variables: { userId: props.ownProps.screenProps.userId }, data })
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteFollowing: {
              __typename: 'Following',
              followingId: ids.userId,
              id: ids.id
            }
          },
        })
      }
    })
  }),
  graphql(
    getUserQuery, {
      options: data => ({
        fetchPolicy: 'cache-and-network',
        variables: { userId: data.screenProps.userId }
      }),
      props: props => {
        const { getUser } = props.data
        let following = []
        if (getUser.following && getUser.following.items) {
          following = getUser.following.items
        }
        return {
          following
        }
      }
    }
  )
)(Following)

const styles = StyleSheet.create({
  unfollow: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.primary
  },
  unfollowText: {
    color: 'white',
    fontFamily: fonts.bold
  },
  userInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    flexDirection: 'row'
  },
  text: {
    flex: 1,
    fontFamily: fonts.regular
  }
})