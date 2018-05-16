import { observable, action } from 'mobx'

class UIStore {
  @observable showTweetModal = false

  @action toggleTweetModal() {
    this.showTweetModal = !this.showTweetModal
  }
}

export default UIStore