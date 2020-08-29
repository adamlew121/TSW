<template>
  <div class="main-app">
    <h1>Login</h1>
    <input class="cstInput"
      type="text"
      name="username"
      v-model="username"
      placeholder="username"
    />
    <br />
    <input class="cstInput"
      type="password"
      name="password"
      v-model="password"
      placeholder="password"
    />
    <br />
    <div v-html="error"></div>
    <button class="cstButton" @click="login">Login</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async login() {
      if (this.username.length > 0 && this.password.length > 0) {
        try {
          const response = await AuthenticationService.login({
            username: this.username,
            password: this.password,
          });
          this.$store.commit('login', response.data.user);
          this.$router.push({
            name: 'notifications',
          });
        } catch (err) {
          this.error = err.response.data.error;
        }
      }
    },
  },
  mounted() {
    if (this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'notifications',
      });
    }
  },
};
</script>

<style scoped>
@import '../sass/main.css';
</style>
