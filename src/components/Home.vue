<template>
  <div class="home">
    <el-nav></el-nav>
    <el-spinner v-if="isLoading" width="60" position="center"></el-spinner>
    <div v-else class="el-container">
      <ol class="el-posts-collection">
        <li v-for="(post, index) in posts" class="post">
          <!-- <em class="el-post-number">{{index}}</em> -->
          <div class="el-post-upvote">
            <button 
              v-if="!user"
              disabled="true" 
              class="waves-effect waves-light btn"
              v-on:click="onUpVote(post.points, post._key)">
              <i class="material-icons">keyboard_arrow_up</i>
            </button>
            <button 
              v-else
              class="waves-effect waves-light btn"
              v-on:click="onUpVote(post.points, post._key)">
              <i class="material-icons">keyboard_arrow_up</i>
            </button>
          </div>
          <div :class="`post-content ${post.image ? 'with-image' : ''}`">
            <div 
              v-if="post.image" 
              class="el-post-image" 
              :style="'background-image: url(' + post.image +');'"></div>
            <a 
              class="el-post-link" 
              :href="post.url">
              <h2 v-html="post.title"></h2> 
              <small>({{post.url}})</small>
            </a>
          </div>
          <div class="el-post-meta">
            {{post.score}} points by <a href="#">{{post.by}}</a> {{timeAgo(post.time)}} ago | <a href="#!" v-on:click.prevent="onNavigate(`post/${post._key}`)">{{post.kids ? post.kids.length : 0}} comments</a>
          </div>  
        </li>
      </ol>
      <button v-if="user" type="button" class="btn-floating btn-large waves-effect waves-light el-add-post" v-on:click="onNavigate('/new-post')">
        <i class="material-icons">add</i>
      </button>
    </div>
  </div>
</template>

<script>
import elNav from './Nav.vue'
import elSpinner from './Spinner.vue'

export default {
  name: 'home',
  created() {
    this.$store.dispatch('WATCH_AUTH_STATE')
      .then( () => {
        // this.loadTopStories()
      })
    
    this.$store.dispatch('SYNCHRONIZE_POSTS').then(ref => {
      this.postsRef = ref
    })
  },
  destroyed() {
    this.postsRef.off()
  },
  data(){
    return {
      postsRef: null
    }
  },
  computed: {
    user(){
      return this.$store.state.account.user
    },
    posts(){
      return this.$store.state.posts.posts
    },
    isLoading(){
      return this.$store.state.posts.isLoading
    }
  },
  components: {
    elNav,
    elSpinner
  },
  methods: {
    loadTopStories(){
      /* get latest hacker news posts */
      const uid = this.$store.state.account.user.uid
      fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        .then( res => {
          res.json().then(ids => {
            console.log('ids: ', ids)
            ids.map(id => {
               fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
                .then( res => {
                  res.json().then( post => { 
                    this.$store.dispatch('NEW_POST', { post: post, uid: uid })
                  })
                })
            })
          })
        })
      .catch(err => {
        console.log('err: ', err)
      })
    },

    loadSingleStory(){
      /* load single story */
      fetch('https://hacker-news.firebaseio.com/v0/item/14754772.json')
      .then( res => {
        res.json().then(post => {
          this.$store.dispatch('NEW_POST', { post: post, uid: uid })
        })
      })
      .catch(err => {
        console.log('err: ', err)
      })
    },
    onNavigate(route){
      this.$router.push(route)
    },
    onUpVote(points, key){
      this.$store.dispatch('UP_VOTE', { points, key })
    },
    timeAgo(createdDate){
      var time = Date.now() - createdDate
      var date = new Date(time*1000)
      var hoursAgo = date.getHours()
      if(hoursAgo > 23){
        var daysAgo = hoursAgo/24
        return daysAgo + ' days'
      } else {
        return  hoursAgo + ' hours'
      }
    },
    urlDomainOnly (url) {
      const domains = [
        '.com',
        '.org',
        '.net',
        '.us',
        '.io',
        '.me'
      ]
      const len = domains.length
      for(let i=0; i<len; i++){
        var domainType = domains[i]
        var typeLength = domainType.length
        var indexAt = url.indexOf(domainType)
        if(indexAt > -1){
          var indexStart = indexAt + typeLength
          return url.substring(0, indexStart)
        }
      }
    }
  }
}
</script>
