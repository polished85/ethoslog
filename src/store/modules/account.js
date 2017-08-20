import { watchAuthState, addUser, signUp, login, logout } from '../api'

export default {
	state: {
    userLoading: false,
    user: null, 
  },

  actions: {
    WATCH_AUTH_STATE: ({ commit }) => {
      watchAuthState( user => {
        if(user){
          commit('SET_USER_STATE', { user: {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            uid: user.uid,
            providerData: user.providerData
          }}) 
        } else {
          commit('SET_USER_STATE', { user: null }) 
        }
        commit('SET_USER_LOADING', false)
      })
    },
    ADD_USER: ({ commit }, { user }) => {
      addUser({key: user.uid, email: user.email})
        .then( () => {
          commit('SET_NOTIFICATION_MESSAGE', 
            { 
              message: 'User created successfully.', 
              type: 'success'
            }
          )
          commit('SHOW_NOTIFICATION')
        })
    },
    SIGN_UP: ({ dispatch, commit }, { email, pw }) => {
      commit('SET_USER_LOADING', true)
      signUp(email, pw)
        .catch( err => console.log('signup error: ', err) )
    },
    LOG_IN: ({ commit }, { email, pw }) => {
      commit('SET_USER_LOADING', true)
      login(email, pw)
        .catch( err => console.log('login error: ', err) )
    },
    LOG_OUT: ({ commit }) => {
      commit('SET_USER_LOADING', true)
      logout()
        .catch( err => console.log('logout error: ', err) )
    }
  },

  mutations: {
    SET_USER_STATE: (state, { user }) => {
      state.user = user
    },
    SET_USER_LOADING: (state, status) => {
      console.log('SET_USER_LOADING: ', status)
      if(status == true || status == false){
        state.userLoading = status
      }
    }
  },

  getters: {

  }
}
