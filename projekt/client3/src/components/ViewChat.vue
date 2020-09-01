<template>
  <div class="mid-app">
      <div>
        <h3>Chat with user: {{receiver.username}}</h3>
        <hr>
        <div class="chat">
          <div class="chat-line" v-for="(msg) in messages" :key = msg>
            <p class="par-pink" v-if="msg.senderId === currentUserId">{{ formatDate(new Date(msg.createdAt)) }},
            {{ msg.senderId === currentUserId ? currentUserUserName : receiver.username }}:
            </p>
            <p class="par-yellow" v-if="msg.senderId != currentUserId">{{ formatDate(new Date(msg.createdAt)) }},
            {{ msg.senderId === currentUserId ? currentUserUserName : receiver.username }}:
            </p>
            {{ msg.text }}
          </div>
        </div>
      </div>
      <div>
        <br />
        <form @submit.prevent="sendMessage">
          <div>
            <input type="text" v-model="message">
          </div>
          <button class="cstInput" type="submit">Send</button>
        </form>
      </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import AuthenticationService from '@/services/AuthenticationService';
import ChatsService from '@/services/ChatsService';

export default {
  data() {
    return {
      receiver: {},
      currentUserId: '',
      currentUserUserName: '',
      message: '',
      messages: [],
      socket: null,
    };
  },
  methods: {
    async sendMessage() {
      if (this.message.length > 0) {
        try {
          const dateNow = new Date();
          await ChatsService.post({
            senderId: this.$store.state.user._id,
            receiverId: this.receiver._id,
            text: this.message,
            createdAt: dateNow,
          });

          this.socket.emit('SEND_MESSAGE', {
            senderId: this.$store.state.user._id,
            receiverId: this.receiver._id,
            text: this.message,
            createdAt: dateNow,
          });
          const messages = (await ChatsService.show(this.receiver._id)).data;
          this.messages = messages;
          this.message = '';
        } catch (err) {
          this.$router.push({
            name: 'offers',
          });
        }
      }
    },
    formatDate(date) {
      return `${this.checkDoubleDigit(date.getDate())}/${this.checkDoubleDigit(date.getMonth())}/
      ${date.getFullYear()} - 
      ${this.checkDoubleDigit(date.getHours())}:${this.checkDoubleDigit(date.getMinutes())}:${this.checkDoubleDigit(date.getSeconds())}`;
    },
    checkDoubleDigit(value) {
      if (value >= 10) {
        return value;
      } else {
        return `0${value}`;
      }
    }
  },
  async mounted() {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers',
      });
    } else {
      try {
        this.socket = io(`wss://${window.location.host}`, {
          transports: ['websocket'],
          upgrade: false,
        });

        const { userId } = this.$store.state.route.params;

        const receiver = (await AuthenticationService.show(userId)).data;
        this.receiver = receiver;
        this.receiverId = receiver._id;

        this.currentUserId = this.$store.state.user._id;
        this.currentUserUserName = this.$store.state.user.username;

        this.messages = (await ChatsService.show(userId)).data;

        this.socket.on('MESSAGE', (data) => {
          if (
            (data.receiverId === this.receiverId && data.senderId === this.$store.state.user._id)
            || (data.receiverId === this.$store.state.user._id && data.senderId === this.receiverId)) {
            this.messages.push(data);
          }
        });
      } catch (err) {
        this.$router.push({
          name: 'offers',
        });
      }
    }
  },

};
</script>

<style scoped>
@import '../sass/main.css';
@import '../sass/tables.css';
</style>
