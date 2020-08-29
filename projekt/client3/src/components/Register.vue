<template>
  <div class="main-app">
    <h1>Register</h1>
    <br />
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
    <button class="cstButton" @click="register">Register</button>
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
    async register() {
      if (this.username.length > 0 && this.password.length > 0) {
        try {
          await AuthenticationService.register({
            username: this.username,
            password: this.password,
          });
          this.$router.push({
            name: 'offers',
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
        name: 'offers',
      });
    }
  },
};
</script>

<style scoped>
@import '../sass/main.css';
</style>
