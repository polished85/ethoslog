<template>
  <div class="single-post">
    <el-nav></el-nav>
    <div class="el-container">
      <a :href="post.url" target="_blank">
        <h1>{{post.title}} <small>({{post.url}})</small></h1>
      </a>
      <img v-if="post.image" :src="post.image"/>
      <form class="new-comment" v-on:submit.prevent="onNewComment">
        <div class="input-field">
          <textarea 
            id="new_comment" 
            class="materialize-textarea validate" 
            v-model="newComment.text"
            v-on:focus="setActiveField('newComment', 'textActive')"
            v-on:blur="unSetActiveField('newComment', 'textActive')"></textarea>
          <label for="new_comment" :class="newComment.textActive ? 'active' : ''">New Comment</label>
        </div>
        <button type="submit" class="btn btn-raised">Add Comment</button>
      </form>
      <div class="el-comments">
        <ol>
          <li v-for="comment in comments">
            <h3>{{ comment.created }} time ago [-]</h3>
            <p>{{ comment.text }}</p>
            <ul class="comment-meta">
              <li>points: {{comment.points}}</li>
              <li>replies: {{comment.comments ? comment.comments.length : 0}}</li>
              <li><a href="#!" v-if="user" type="button" class="btn-link">reply</a></li>
            </ul>
          </li>
          <!-- <li>
            <h3>stingrae 4 hours ago [-]</h3>
            <p>The days of consumer hardware company&apos;s access to startup capital is over. With so many high profile VC backed (Fitbit, GoPro, Hello, Juicero, Coin, Pearl, ect.) and kickstarted (Lily.ai, Pebble) failures, no one is willing to risk it.</p>
            <ol>
              <li>
                <h3>replicatorblog 4 hours ago [-]</h3>
                <p>I&apos;d ascribe the failure to the commodification of the fitness tracker and increasingly platform-driven smart speaker space. Here are some companies that have raised big rounds recently:
                <ul>
                  <li>+ SimpliSafe raised $57M from Sequoia</li>
                  <li>+ Ring raised $100M+from DFJ</li>
                  <li>+ Formlabs raised $50M from Foundry</li>
                  <li>+ Sphero raised $23M in April</li>
                  <li>+ Anki raised $52.5M in PE</li>
                </ul>
                I&apos;m not sure what the future holds for Anki/Sphero, but the first three examples have what GoPro/FitBit didn&apos;t — a clear recurring business model. This is a good blog post on the subject:
                https://blog.bolt.io/the-3-business-models-that-matter-for-c&hellip;</p>
                <ol>
                  <li>
                    <h3>icelancer 3 hours ago [-]</h3>
                    <p>>SimpliSafe <br/>
                      We use SimpliSafe at work. It solves far more problems than the "commodity hardware" issue. It solves the alarm ecosystem and shitty contracts that legacy carriers like ADT trap you into. It's definitely a good model going forward, as you noted. <br/>
                      EDIT: Additionally, it solves a "boring" problem, which not many companies want to tackle. Yet there's tons and tons of stable recurring revenue in this space that requires almost no additional innovation. Just stability, no-bullshit, and good customer service.
                    </p>
                  </li>
                  <li>
                    <h3>stingrae 3 hours ago [-]</h3>
                    <p>I would argue that Ring is the primary consumer success that the VCs are looking at right now. Everything else is not looking good. <br/>
                    Simplisafe raised the $57m in 2014 and seems to have been able to make a sustainable business without VC money. Form Labs is seemingly (with the rest of 3D printing) moving away from consumer to B2B focus. <br />
                    I find Sphero/Anki raises surprising and wouldn't be surprised if they had Chinese Funds leading the rounds.</p>
                  </li>
                  <li>
                    <h3>girvo 3 hours ago [-]</h3>
                    <p>I love my Sphero BB8. Cutest little toy I've ever had. I can't see them taking over the world though, that's a big round comparatively I would think</p>
                  </li>
                </ol>
              </li> -->
            </ol>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import elNav from './Nav.vue'
import elSpinner from './Spinner.vue'

export default {
  name: 'SinglePost',
  created() {
    this.$store.dispatch('SYNCHRONIZE_POST', { key: this.$route.params.postId }).then(ref => {
      this.postRef = ref
    })
    this.$store.dispatch('SYNCHRONIZE_COMMENTS', { parentId: this.$route.params.postId }).then(ref => {
      this.commentsRef = ref
    })
    this.$store.dispatch('WATCH_AUTH_STATE')
  },
  destroyed() {
    this.postRef.off()
    this.commentsRef.off()
  },
  data(){
    return {
      postRef: null,
      commentsRef: null,
      newComment: {
        text: '',
        textActive: false
      }
    }
  },
  computed: {
    user(){
      return this.$store.state.account.user
    },
    post(){
      return this.$store.state.posts.post
    },
    comments(){
       const comments = this.$store.state.comments.comments
       console.log('comments: ', comments)
       return comments
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
    },
    onNewComment(){
      this.$store.dispatch('NEW_COMMENT', {
        comment: this.newComment,
        uid: this.$store.state.account.user.uid,
        parentId: this.$route.params.postId
      })
      this.newComment = ''
    }
  },
  components: {
    elNav
  }
}
</script>