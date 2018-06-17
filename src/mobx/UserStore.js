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

}

export default UserStore
