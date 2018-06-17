import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { getUserQuery } from 'AWSTwitter/src/graphql/queries'
import { graphql, compose } from 'react-apollo'
import { fonts } from 'AWSTwitter/src/theme'

@inject('userStore')
@observer
class Following extends React.Component {
  render() {
    return (
        <ScrollView>
          <View>
            {
              this.props.following.items && this.props.following.items.map((item, index) => (
                <View key={index} style={styles.userInfo}>
                <Text style={styles.text}>{item.username}</Text>
              </View>
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
        const { getUser } = props.data
        let following = []
        if (getUser.following) {
          following = getUser.following
        }
       
        return {
          following
        }
      }
    }
  )
)(Following)

const styles = StyleSheet.create({
  userInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed'
  },
  text: {
    fontFamily: fonts.regular
  }
})