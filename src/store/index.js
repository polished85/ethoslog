import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import notification from './modules/notification'
import posts from './modules/posts'
import comments from './modules/comments'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    account,
    posts,
    comments,
    notification
  }
})

export default store
