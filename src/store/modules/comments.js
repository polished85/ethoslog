import Vue from 'vue'
import { newComment, synchronizeList } from '../api'

export default {
  state: {
    isLoading: true,
    comments:  []
  },

  actions: {
    SYNCHRONIZE_COMMENTS: ({ commit, state }, { parentId }) => {
      state.comments = []
      var cbs = {
        onChildAdded(pos, data){
          commit('ADD_COMMENT', { pos, data })
        },
        onChildRemoved(i){
          commit('REMOVE_COMMENT', i)
        },
        onChildChanged(i, value){
          commit('UPDATE_COMMENT', { i, value })
        },
        onChildMoved(newPos, data){
          commit('MOVE_COMMENT', { newPos, data })
        }
      }
      commit('SET_LOADING_STATUS', { status: false })
      return synchronizeList(state.comments, `comments/${parentId}`, cbs)
    },
    NEW_COMMENT: ({ commit, dispatch, state }, { comment, uid, parentId }) => {
      newComment(comment, uid, parentId)
        .then(msg => { 
          console.log('msg: ', msg)
        })
        .catch(err => {
          console.log('post not added: ', err.code, err.message)
        })
    },
    REMOVE_COMMENT: ({ commit, dispatch, state }, { key }) => {
      removePost(key)
        .then(res => {
          console.log('post has definitely been removed! ', res)
        })
        .catch(err => {
          console.log('post not added: ', err.code, err.message)
        })
    }
  },

  mutations: {
    ADD_COMMENT: (state, { pos, data }) => {
      state.comments.splice(pos, 0, data)
    },
    REMOVE_COMMENT: (state, i) => {
      state.comments.splice(i, 1)
    },
    UPDATE_COMMENT: (state, { i, value }) => {
      Vue.set(state.comments, i, value)
    },
    MOVE_COMMENT: (state, { newPos, data }) => {
      state.comments.splice(newPos, 0, data)
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
