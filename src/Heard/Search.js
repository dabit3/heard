import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native'
import { listUsers } from 'AWSTwitter/src/graphql/queries'
import { graphql, compose } from 'react-apollo'
import { fonts } from 'AWSTwitter/src/theme'

class Search extends React.Component {
  render() {
    return (
        <ScrollView>
          <View>
            {
            this.props.users.map((user, index) => (
              <View key={index} style={styles.userInfo}>
                <Text style={styles.text}>{user.username}</Text>
              </View>
            ))
          }
          </View>
        </ScrollView>
    )
  }
}

export default compose(
  graphql(listUsers, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: props => ({
      users: props.data.listUsers ? props.data.listUsers.items : []
    })
  })
)(Search)

const styles = StyleSheet.create({
  userInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed'
  },
  text: {
    fontFamily: fonts.regular
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})