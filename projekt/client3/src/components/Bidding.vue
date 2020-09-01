<template>
  <div class="mid-app">
      <div>
        <h3> Current price: {{offer.price}} USD</h3>
        <hr>
      </div>
      <div >
        <table>
          <tr v-for="(bid, index) in bids" :key="index">
          <td class="mid-table-username">{{ bid.bidderName }}: </td>
          <td class="mid-table-bid"> {{ bid.price }} </td>
          </tr>
        </table>
      </div>
      <div>
        <br />
        <form v-if="canBid" @submit.prevent="sendMessage">
          <div>
            <label for="price">Your Bid:</label>
            <br />
            <input type="number" v-model="price">
          </div>
          <button v-bind:disabled="offer.biddingStatus !== 2"
            type="submit" class="createButton">Send
          </button>
        </form>
      </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import OffersService from '@/services/OffersService';

export default {
  data() {
    return {
      offer: {},
      price: '',
      bids: [],
      socket: null,
      canBid: true,
    };
  },
  methods: {
    async sendMessage() {
      if (this.price > this.offer.price) {
        try {
          await OffersService.bid({
            offerId: this.offer._id,
            price: this.price,
          });
          this.socket.emit('SEND_BID', {
            bidderId: this.$store.state.user._id,
            bidderName: this.$store.state.user.username,
            price: this.price,
            offerId: this.offer._id,
          });
          const offer = (await OffersService.show(this.offer._id)).data;
          this.offer = offer;
          this.price = '';
        } catch (err) {
          console.log(err);
          this.$router.push({
            name: 'offers',
          });
        }
      }
    },
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

        const { offerId } = this.$store.state.route.params;

        const bids = (await OffersService.indexBids(offerId)).data;
        this.bids = bids;

        this.offer = (await OffersService.show(offerId)).data;

        if (this.$store.state.user._id === this.offer.author) {
          this.canBid = false;
        }

        this.socket.on('BID', (data) => {
          if (data.offerId === this.offer._id) {
            this.bids.push(data);
            this.offer.price = data.price;
          }
        });
      } catch (err) {
        console.log(err);
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
