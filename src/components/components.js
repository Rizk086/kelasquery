import { reactive } from 'vue'

export const sideNav = reactive({
  state: false,
  force_hidden: false,
  toggle() {
    this.state = !this.state
  },
  shut() {
    this.state = false
  },
})

export const modal = reactive({
  visible: false,
  inputBox: true,
  title: '',
  content: '',
  confirmText: 'OK',
  input_value: '',
  confirmButton: 'Done',
  handleClose() {
    this.visible = false
  },
  handleUpdate() {
    this.visible = false
    return this.content
  },
  popup(title, content, confirmText = 'OK', input = '', confirmButton = 'Done', includeInputBox = true) {
    this.title = title
    this.content = content
    this.confirmText = confirmText
    this.input_value = input
    this.visible = true
    this.inputBox = includeInputBox
    this.confirmButton = confirmButton
    return new Promise((resolve) => {
      this.handleClose = () => {
        this.visible = false
        resolve(this.input_value)
      }
      this.handleUpdate = (value) => {
        this.input_value = value
        resolve(value)
      }
    })
  }
})
