import { observable, action } from 'mobx'

class UIStore {
  @observable showMessageModal = false

  @action toggleMessageModal() {
    this.showMessageModal = !this.showMessageModal
  }
}

export default UIStore