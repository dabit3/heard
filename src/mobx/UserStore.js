import { observable, action } from 'mobx'

class UserStore {
  @observable user = {}

  @action updateUser(user) {
    this.user = user
  }
}

export default UserStore
