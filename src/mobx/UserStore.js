import { computed, observable, action } from 'mobx'

class UserStore {
  @observable user = {}
  @observable loadingUser = true

  @action updateUser(user) {
    this.user = user
  }

  @action updateUserLoading(val) {
    this.loadingUser = val
  }

  @computed get tweets() {
    if (!this.user.following) return []
    const tweets = this.user.following.items.reduce((acc, next) => {
      acc.push(...next.tweets.items)
      return acc
    }, [])
    tweets.push(...this.user.tweets.items)
    tweets.sort(function (a, b) {
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      return dateA - dateB;
    });
    return tweets
  }
}

export default UserStore
