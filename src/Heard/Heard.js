import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from 'react-native'

import { createBottomTabNavigator, createDrawerNavigator } from 'react-navigation'
import { inject, observer } from 'mobx-react'

import Drawer from 'AWSTwitter/src/components/DrawerNav'
import Modal from 'AWSTwitter/src/components/TweetModal'
import { search, home, create, logo } from 'AWSTwitter/src/assets/images'
import { colors } from 'AWSTwitter/src/theme'
import Search from './Search'
import Feed from './Feed'

const Tabs = createBottomTabNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={home}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={search}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    showLabel: false,
    style: {
      backgroundColor: 'white',
      borderTopColor: '#ededed',
      borderTopWidth: 1
    }
  }
});

@inject('uiStore')
@observer
class Home extends React.Component {
  static router = Tabs.router
  toggleDrawer = () => {
    this.props.navigation.openDrawer()
  }
  render() {
    console.log('props:', this.props)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={this.toggleDrawer}>
            <View style={styles.avatarContainer}>
              <Image source={logo} style={styles.avatar} />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.headerRight}>
            <View style={styles.createIconContainer}>
              <TouchableWithoutFeedback
                onPress={() => this.props.uiStore.toggleTweetModal()}
              >
                <Image source={create} style={styles.create} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <Tabs navigation={this.props.navigation} />
        <Modal />
      </View>
    )
  }
}

export default createDrawerNavigator({
  Home: { screen: Home }
}, {
  contentComponent: () => <Drawer />
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 15,
    paddingTop: 25,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  avatarContainer: {
    width: 38,
    height: 38,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 26,
    height: 26,
    tintColor: 'white'
  },
  createIconContainer: {
    marginTop: 5,
    marginRight: 5
  },
  create: {
    tintColor: colors.primary,
    height: 36,
    width: 36
  },
  icon: {
    width: 28,
    height: 28
  }
})