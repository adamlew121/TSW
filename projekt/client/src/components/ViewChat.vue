<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Chat with user: {{receiver.username}}</h3>
              <hr>
          </div>
          <div class="card-body">
              <div class="bids" v-for="(msg, index) in messages" :key="index">
                  <p><span class="font-weight-bold">{{ msg.senderId === currentUserId ? currentUserUserName : receiver.username }}: </span>{{ msg.text }} /// {{ formatDate(new Date(msg.createdAt)) }}</p>
              </div>
          </div>
      </div>
      <div class="card-footer">
          <form @submit.prevent="sendMessage">
              <div class="gorm-group pb-3">
                  <label for="price">Your Message:</label>
                  <input type="text" v-model="message" class="form-control">
              </div>
              <button type="submit" class="btn btn-success">Send</button>
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
      socket: io('https://localhost:8081')
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
      return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
    }
  },
  async mounted () {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers'
      })
    } else {
      try {
        const userId = this.$store.state.route.params.userId

        const receiver = (await AuthenticationService.show(userId)).data
        this.receiver = receiver

        this.currentUserId = this.$store.state.user._id
        this.currentUserUserName = this.$store.state.user.username

        this.messages = (await ChatsService.show(userId)).data
        // console.log(this.offer)

        this.socket.on('MESSAGE', (data) => {
          if ((data.receiverId === this.receiverId && data.senderId === this.$store.state.user._id) ||
          (data.receiverId === this.$store.state.user._id && data.senderId === this.receiverId)) {
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

<style scoped></style>
