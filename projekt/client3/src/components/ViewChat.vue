<template>
  <div class="mid-app">
      <div>
        <h3>Chat with user: {{receiver.username}}</h3>
        <hr>
        <table id="chatbox" class="main-table">
        <tr v-for="(msg, index) in messages" :key="index">
         <td> {{ formatDate(new Date(msg.createdAt)) }}, </td>
         <td>{{ msg.senderId === currentUserId ? currentUserUserName : receiver.username }}: </td>
         <td> {{ msg.text }} </td>
        </tr>

        </table>
      </div>
      <div>
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
import io from 'socket.io-client'
import AuthenticationService from '@/services/AuthenticationService'
import ChatsService from '@/services/ChatsService'
export default {
  data () {
    return {
      receiver: {},
      currentUserId: '',
      currentUserUserName: '',
      message: '',
      messages: [],
      socket: null
    }
  },
  methods: {
    async sendMessage () {
      if (this.message.length > 0) {
        try {
          var dateNow = new Date()
          await ChatsService.post({
            senderId: this.$store.state.user._id,
            receiverId: this.receiver._id,
            text: this.message,
            createdAt: dateNow
          })

          this.socket.emit('SEND_MESSAGE', {
            senderId: this.$store.state.user._id,
            receiverId: this.receiver._id,
            text: this.message,
            createdAt: dateNow
          })
          const messages = (await ChatsService.show(this.receiver._id)).data
          this.messages = messages
          this.message = ''
        } catch (err) {
          console.log(err)
        }
      }
    },
    formatDate (date) {
      return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' - ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
  },
  async mounted () {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers'
      })
    } else {
      try {
        this.socket = io(`wss://${window.location.host}`)

        const userId = this.$store.state.route.params.userId

        const receiver = (await AuthenticationService.show(userId)).data
        this.receiver = receiver
        this.receiverId =receiver._id

        this.currentUserId = this.$store.state.user._id
        this.currentUserUserName = this.$store.state.user.username

        this.messages = (await ChatsService.show(userId)).data
        // console.log(this.offer)

        this.socket.on('MESSAGE', (data) => {
          console.log('got message')
          console.log('if ((' + data.receiverId + '===' + this.receiverId + '&&'  + data.senderId + '===' + this.$store.state.user._id + ') || (' + data.receiverId + '==='  + this.$store.state.user._id + '&&' + data.senderId + '===' + this.receiverId+ '))')
          if ((data.receiverId === this.receiverId && data.senderId === this.$store.state.user._id) ||
          (data.receiverId === this.$store.state.user._id && data.senderId === this.receiverId)) {
            console.log('validated message')
            this.messages.push(data)
            
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

}
</script>

<style scoped>
@import '../sass/main.css';
@import '../sass/tables.css';
</style>
