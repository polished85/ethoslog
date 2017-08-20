import { watchAuthState, signUp, login, logout } from '../api'

export default {
	state: {
		isActive: false,
    type: '',
    message: '', 
  },

  actions: {

  },

  mutations: {
    SHOW_NOTIFICATION: (state) => {
      state.isActive = true
    },
    HIDE_NOTIFICATION: (state) => {
      state.isActive = false
    },
    SET_NOTIFICATION_MESSAGE: (state, { message, type }) => {
      state.message = message,
      state.type = type
    }
  },

  getters: {

  }
}
