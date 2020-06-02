<template>
<div>
    <h2>Nav Bar</h2>
    <nav>
      <div v-if="!$store.state.isUserLoggedIn">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
      </div>
      <div v-if="$store.state.isUserLoggedIn">
        <router-link to="/historyBidding">Active-Biddings</router-link>
        <router-link to="/history">History</router-link>
        <router-link to="/chats">Chats</router-link>
        <button @click="logout">Log Out</button>
      </div>
      <router-link to="/offers">Offers</router-link>
    </nav>
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

</style>
