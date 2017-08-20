import Vue from 'vue'
import { newPost, removePost, upVotePost, synchronizeList, synchronizeItem } from '../api'

export default {
  state: {
    isLoading: true,
    posts:  [],
    post: null
  },

  actions: {
    SYNCHRONIZE_POSTS: ({ commit, state }) => {
      state.posts = []
      var cbs = {
        onChildAdded(pos, data){
          commit('ADD_POST', { pos, data })
        },
        onChildRemoved(i){
          commit('REMOVE_POST', i)
        },
        onChildChanged(i, value){
          commit('UPDATE_POST', { i, value })
        },
        onChildMoved(newPos, data){
          commit('MOVE_POST', { newPos, data })
        }
      }
      commit('SET_LOADING_STATUS', { status: false })
      return synchronizeList(state.posts, 'posts', cbs)
    },
    SYNCHRONIZE_POST: ({ commit, dispatch, state }, { key }) => {
      function cb(data){
        console.log('data: ', data)
        console.log('key: ', key)
        commit('SET_SINGLE_POST', data[key])
      }
      return synchronizeItem('posts', key, cb)
    },
    NEW_POST: ({ commit, dispatch, state }, { post, uid }) => {
      console.log('uid: ', uid)
      newPost(post, uid)
        .then(msg => { 
          console.log('msg: ', msg)
        })
        .catch(err => {
          console.log('post not added: ', err.code, err.message)
        })
    },
    REMOVE_POST: ({ commit, dispatch, state }, { key }) => {
      removePost(key)
        .then(res => {
          console.log('post has definitely been removed! ', res)
        })
        .catch(err => {
          console.log('post not added: ', err.code, err.message)
        })
    },
    UP_VOTE: ({ commit }, { points, key }) => {
      upVotePost(points, key)
        .then(msg => { 
          console.log('msg: ', msg)
        })
        .catch(err => {
          console.log('points not added: ', err.code, err.message)
        })
    }
  },

  mutations: {
    ADD_POST: (state, { pos, data }) => {
      state.posts.splice(pos, 0, data)
    },
    REMOVE_POST: (state, i) => {
      state.posts.splice(i, 1)
    },
    UPDATE_POST: (state, { i, value }) => {
      Vue.set(state.posts, i, value)
    },
    MOVE_POST: (state, { newPos, data }) => {
      state.posts.splice(newPos, 0, data)
    },
    SET_SINGLE_POST: (state, post) => {
      state.post = post
    }, 
    SET_LOADING_STATUS: (state, { status }) => {
      if(status == true || status == false){
        state.isLoading = status
      }
    }
  },

  getters: {

  }
}
