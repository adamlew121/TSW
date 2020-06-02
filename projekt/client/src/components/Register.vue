<template>
  <div>
    <h1>Register</h1>

    <input
      type="text"
      name="username"
      v-model="username"
      placeholder="username"
    />
    <br />
    <input
      type="password"
      name="password"
      v-model="password"
      placeholder="password"
    />
    <br />
    <div v-html="error"></div>
    <button @click="register">Register</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async register () {
      try {
        const response = await AuthenticationService.register({
          username: this.username,
          password: this.password
        })
        console.log(':0')
        this.$store.dispatch('setToken', response.data.token)
        console.log(':1')
        this.$store.dispatch('setUser', response.data.user)
        console.log(':2')
        this.$router.push({
          name: 'offers'
        })
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  },
  mounted () {
    if (this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers'
      })
    }
  }
}
</script>

<style scoped></style>
