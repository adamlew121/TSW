<template>
<div class="navBar">
    <nav>
      <router-link v-if="!$store.state.isUserLoggedIn" class="navElem" to="/login">Login</router-link>
      <router-link v-if="!$store.state.isUserLoggedIn" class="navElem" to="/register">Register</router-link>
      <router-link v-if="$store.state.isUserLoggedIn" class="navElem" to="/historyBidding">Active-Biddings</router-link>
      <router-link v-if="$store.state.isUserLoggedIn" class="navElem" to="/history">History</router-link>
      <router-link v-if="$store.state.isUserLoggedIn" class="navElem" to="/chats">Chats</router-link>
      <router-link class="navElem" to="/offers">Offers</router-link>
      <button v-if="$store.state.isUserLoggedIn" class="navElem" @click="logout">Log Out</button>
    </nav>
    <div class="userData" v-if="$store.state.isUserLoggedIn">
      Zalogowany: {{$store.state.user.username}}
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'offers'
      })
    }
  }
}
</script>

<style scoped>
@import '../sass/pageHeader.css'
</style>
