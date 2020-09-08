<template>
<div class="navBar">
    <nav>
      <router-link v-if="!$store.state.isUserLoggedIn"
        class="navElem" to="/login">Login
      </router-link>
      <router-link v-if="!$store.state.isUserLoggedIn"
        class="navElem" to="/register">Register
      </router-link>
      <router-link v-if="$store.state.isUserLoggedIn"
        class="navElem" to="/historyBidding">Active-Biddings
      </router-link>
      <router-link v-if="$store.state.isUserLoggedIn"
        class="navElem" to="/history">History
      </router-link>
      <router-link v-if="$store.state.isUserLoggedIn"
        v-bind:class="this.chatClass" to="/chats">Chats
      </router-link>
      <router-link
        class="navElem" to="/offers">Offers
      </router-link>
      <button v-if="$store.state.isUserLoggedIn"
        class="navElem" @click="logout">Log Out
      </button>
    </nav>
    <div class="userData" v-if="$store.state.isUserLoggedIn">
      Zalogowany: {{$store.state.user.username}}
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      chatClass: '',
      default: true,
      hasNewMessage: false,
      socket: null,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push({
        name: 'offers',
      });
    },
  },
  async mounted() {

      try {
        this.chatClass = 'navElem';
        this.socket = io(`wss://${window.location.host}`, {
          transports: ['websocket'],
          upgrade: false,
        });
        this.socket.on('MESSAGE', (data) => {
          console.log('111');
          if ( data.receiverId === this.$store.state.user._id) {
            this.chatClass = 'navElem2';
              this.default = false;
              this.hasNewMessage = true;
          }
        });
      } catch (err) {
        console.log(err);
        this.$router.push({
          name: 'offers',
        });
      }
    },
};
</script>

<style scoped>
@import '../sass/pageHeader.css'
</style>
