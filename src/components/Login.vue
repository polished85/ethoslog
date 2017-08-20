<template>
  <div class="login">
    <el-nav></el-nav>
    <div class="el-container">
      <div v-if="user" class="row">
        <div class="col s12 center-align">
          <p class="flow-text">Hey {{user.email}}, you are already logged in.</p>
          <button type="submit" class="btn btn-raised" v-on:click.prevent="onLogout">Logout</button>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col s12">
            <h5>Login</h5>
          </div>
          <form class="col s12" v-on:submit.prevent="onLogin">
            <div class="input-field">
              <input 
                id="login_email" 
                type="text" 
                class="validate" 
                v-model="login.email"
                v-on:focus="setActiveField('login', 'emailActive')"
                v-on:blur="unSetActiveField('login', 'emailActive')" />
              <label for="login_email" :class="login.emailActive ? 'active' : ''">Email</label>
            </div>
            <div class="input-field">
              <input id="login_password" type="password" class="validate" v-model="login.password"
                v-on:focus="setActiveField('login', 'passwordActive')"
                v-on:blur="unSetActiveField('login', 'passwordActive')" />
              <label for="login_password" :class="login.passwordActive ? 'active' : ''">Password</label>
            </div>
            <button type="submit" class="btn btn-raised">Login</button>
          </form>
        </div>
        <div class="row">
          <div class="col s12">
            <h5>Create Account</h5>
          </div>
          <form class="col s12" v-on:submit.prevent="onSignUp">
            <div class="input-field">
              <input id="sign_up_email" type="text" class="validate" v-model="create.email"
                v-on:focus="setActiveField('create', 'emailActive')"
                v-on:blur="unSetActiveField('create', 'emailActive')" />
              <label for="sign_up_email" :class="create.emailActive ? 'active' : ''">Email</label>
            </div>
            <div class="input-field">
              <input id="sign_up_password" type="password" class="validate" v-model="create.password" 
                v-on:focus="setActiveField('create', 'passwordActive')"
                v-on:blur="unSetActiveField('create', 'passwordActive')" />
              <label for="sign_up_password" :class="create.passwordActive ? 'active' : ''">Password</label>
            </div>
            <button type="submit" class="btn btn-raised">Create Account</button>
          </form>
        </div>
      </div>
    </div>
    <el-spinner v-if="userLoading" position="bottom-right" width="40"></el-spinner>
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
      login: {
        email: '',
        password: '',
        emailActive: false,
        passwordActive: false
      },
      create: {
        email: '',
        password: '',
        emailActive: false,
        passwordActive: false
      }
    }
  },
  computed: {
    user(){
      return this.$store.state.account.user
    },
    userLoading() {
      return this.$store.state.account.userLoading
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
    onLogin(){
      this.$store.dispatch('LOG_IN', {
        email: this.login.email,
        pw: this.login.password
      })
      this.login.email = ''
      this.login.password = ''
    },
    onLogout(){
      this.$store.dispatch('LOG_OUT')
    },
    onSignUp(){
      this.$store.dispatch('SIGN_UP', {
        email: this.create.email,
        pw: this.create.password
      })
      this.create.email = ''
      this.create.password = ''
    },
  },
  components: {
    elNav,
    elSpinner
  }
}
</script>
