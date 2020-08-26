<template>
  <div class="mid-app">
      <div>
        <h3> Current price: {{offer.price}} USD</h3>
        <hr>
      </div>
      <div >
        <table class="mid-table">
          <tr v-for="(bid, index) in bids" :key="index">
          <td>{{ bid.bidderName }}: </td>
          <td> {{ bid.price }} </td>
          </tr>
        </table>
      </div>
      <div>
        <form @submit.prevent="sendMessage">
          <div>
            <label for="price">Your Bid:</label>
            <input type="number" v-model="price">
          </div>
          <button v-bind:disabled="offer.biddingStatus !== 2" type="submit" class="btn btn-success">Send</button>
        </form>
      </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import OffersService from '@/services/OffersService'
export default {
  data () {
    return {
      offer: {},
      price: '',
      bids: [],
      socket: null
    }
  },
  methods: {
    async sendMessage () {
      if (this.price > this.offer.price) {
        try {
          await OffersService.bid({
            offerId: this.offer._id,
            price: this.price
          })
          this.socket.emit('SEND_BID', {
            bidderId: this.$store.state.user._id,
            bidderName: this.$store.state.user.username,
            price: this.price,
            offerId: this.offer._id
          })
          console.log('bid made')
          const offer = (await OffersService.show(this.offer._id)).data
          this.offer = offer
          this.price = ''
        } catch (err) {
          console.log(err)
        }
      }
    }
  },
  async mounted () {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers'
      })
    } else {
      try {

        this.socket = io(`wss://${window.location.host}`, {
          transports: ['websocket'],
          upgrade: false
        })

        const offerId = this.$store.state.route.params.offerId

        const bids = (await OffersService.indexBids(offerId)).data
        this.bids = bids

        this.offer = (await OffersService.show(offerId)).data
        // console.log(this.offer)

        this.socket.on('BID', (data) => {
          console.log('bid received: ')
          console.log(data)
          console.log('this offer: ')
          console.log(this.offer)
          if (data.offerId === this.offer._id) {
            this.bids.push(data)
            this.offer.price = data.price
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
