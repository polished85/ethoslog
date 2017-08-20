<template>
	<nav class="el-nav">
	  <div class="nav-wrapper">
	    <a href="#" class="brand-logo" v-on:click.stop.prevent="onNavigate('/')">ethoslog</a>
	    <a 
	    	v-on:click="onShowSideNav"
	    	href="#"
	    	class="button-collapse">
	    	<i class="material-icons">menu</i>
	    </a>
	    <ul class="right hide-on-med-and-down">
        <li><a href="#!" v-on:click.stop.prevent="onNavigate('/')">top stories</a></li>
        <li>
          <a v-if="!user" href="#!" v-on:click.stop.prevent="onNavigate('/login')">login</a>
          <a v-else href="#!" v-on:click.stop.prevent="onLogout">logout</a>
        </li>
	    </ul>
	    <ul v-if="sideNavVisible" class="side-nav" style="transform: translateX(0%);">
        <li><a href="#!" v-on:click.stop.prevent="onNavigate('/')">top stories</a></li>
        <li>
          <a v-if="!user" href="#!" v-on:click.stop.prevent="onNavigate('/login')">login</a>
          <a v-else href="#!" v-on:click.stop.prevent="onLogout">logout</a>
        </li>
      </ul>
      <div v-if="dropDownVisible" class="dropdown-content-overlay" v-on:click="onHideDropDown"></div>
      <transition name="fade">
      	<div v-if="sideNavVisible" id="sidenav-overlay" v-on:click="onHideSideNav"></div>
      </transition>
	  </div>
	</nav>
</template>

<script>
export default {
  name: 'elNav',
  data () {
    return {
      sideNavVisible: false,
      dropDownVisible: false
    }
  },
  computed: {
    user(){
      return this.$store.state.account.user
    }
  },
  methods: {
    onLogout(){
      this.$store.dispatch('LOG_OUT')
    },
  	onShowSideNav(){
  		this.sideNavVisible = true
  	},
  	onHideSideNav(){
  		this.sideNavVisible = false
  	},
    onShowDropDown(){
      this.dropDownVisible = true
    },
    onHideDropDown(){
      this.dropDownVisible = false
    },
    onNavigate(route){
      this.$router.push(route)
    }
  }
}
</script>
