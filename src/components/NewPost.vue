<template>
  <div class="login">
    <el-nav></el-nav>
    <div class="el-container">
      <div v-if="user" class="row">
        <div class="col s12 center-align">
          <h1>Add a new story</h1>
          <div class="row">
            <form class="col s12" v-on:submit.prevent="onNewPost">
              <div class="input-field">
                <input 
                  id="post_title" 
                  type="text" 
                  class="validate" 
                  v-model="newPost.title"
                  v-on:focus="setActiveField('newPost', 'titleActive')"
                  v-on:blur="unSetActiveField('newPost', 'titleActive')" />
                <label for="post_title" :class="newPost.titleActive ? 'active' : ''">Title</label>
              </div>
              <div class="input-field">
                <input 
                  id="post_url" 
                  type="text" 
                  class="validate" 
                  v-model="newPost.url"
                  v-on:focus="setActiveField('newPost', 'urlActive')"
                  v-on:blur="unSetActiveField('newPost', 'urlActive')" />
                <label for="post_url" :class="newPost.urlActive ? 'active' : ''">URL</label>
              </div>
              <div class="input-field">
                <input 
                  id="post_image" 
                  type="text" 
                  class="validate" 
                  v-model="newPost.image"
                  v-on:focus="setActiveField('newPost', 'imageActive')"
                  v-on:blur="unSetActiveField('newPost', 'imageActive')" />
                <label for="post_image" :class="newPost.imageActive ? 'active' : ''">Image</label>
              </div>
              <button type="submit" class="btn btn-raised">New Story</button>
            </form>
          </div>
        </div>
      </div>
      <div v-else class="row">
        <div class="col s12 center-align">
          <p class="flow-text">Must be logged in to post a story.</p>
        </div>
      </div>
    </div>
    <el-spinner v-if="isBusy" width="40" position="bottom-right"></el-spinner>
  </div>
</template>

<script>
import elNav from './Nav.vue'
import elSpinner from './Spinner.vue'

export default {
  name: 'Login',
  created() {
    this.$store.dispatch('WATCH_AUTH_STATE')
  },
  data () {
    return {
      newPost:   {
        title: '',
        url: '',
        image: '',
        titleActive: false,
        urlActive: false,
        imageActive: false
      }
    }
  },
  computed: {
    isBusy(){
      return true
    },
    user(){
      return this.$store.state.account.user
    }
  },
  methods: {
    setActiveField(type, field){
      console.log('setActiveField: ', field)
      this[type][field] = true
    },
    unSetActiveField(type, field){
      console.log('unSetActiveField: ', field)
      this[type][field] = false
    },
    onNewPost(){
      this.$store.dispatch('NEW_POST', { 
        post: {
          title: this.newPost.title,
          url: this.newPost.url,
          image: this.newPost.image
        },
        uid: this.$store.state.account.user.uid
      })
      this.newPost.title = ''
      this.newPost.url = ''
      this.newPost.image = ''
    }
  },
  components: {
    elNav,
    elSpinner
  }
}
</script>
