<template>
<div class="main-app">

  <table class="cstTable">
    <tr>
      <th>Status</th>
      <th>Title</th>
      <th>Price</th>
      <th>Option</th>
      <th>Details</th>
      <th>Make new bid</th>
    </tr>
  <tr v-for="(offer) in visibleOffers" :key="offer.id">
    <td> {{isAuthor(offer) ? 'AUTHOR' : ''}} {{!isAuthor(offer) && offer.closed ? 'CLOSED' : ''}} {{!isAuthor(offer) && !offer.closed ? 'OPEN' : ''}} </td>
    <td>{{offer.title}}</td>
    <td>{{offer.price}}</td>
    <td>{{getOption(offer)}}</td>
    <td><button
    @click="navigateTo({
      name: 'offer',
      params: {
        offerId: offer._id
        }
      })">
      View Offer
    </button>
    </td>
    <td><input
      type="number"
      name="price"
      v-model="price"
      placeholder="price"
    />
    <button
    @click="dynamicBid(offer, index)">
      Bid
      </button> </td>
  </tr>
  </table>
  <div v-if="totalPages() > 0" class="pagination">
    <span v-if="showPreviousLink()" class="pagination-btn" v-on:click="updatePage(currentPage - 1)"> &lt; </span>
    {{ currentPage + 1 }} of {{ totalPages() }}
    <span v-if="showNextLink()" class="pagination-btn" v-on:click="updatePage(currentPage + 1)"> &gt; </span>
  </div>
</div>
</template>

<script>
import OffersService from '@/services/OffersService'
import io from 'socket.io-client'
export default {
  data () {
    return {
      offers: {},
      visibleOffers: {},
      price: 0,
      currentPage: 0,
      pageSize: 5,
      socket: io('https://localhost:8081')
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    updateVisibleOffers () {
      this.visibleOffers = this.offers.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize)
      if (this.visibleOffers.length === 0 && this.currentPage > 0) {
        this.updatePage(this.currentPage - 1)
      }
    },
    updatePage (pageNumber) {
      this.currentPage = pageNumber
      this.updateVisibleOffers()
    },
    totalPages () {
      return Math.ceil(this.offers.length / this.pageSize)
    },
    showPreviousLink () {
      return this.currentPage !== 0
    },
    showNextLink () {
      return this.currentPage !== (this.totalPages() - 1)
    },
    isAuthor (offer) {
      return this.$store.state.isUserLoggedIn && offer.author === this.$store.state.user._id
    },
    getOption (offer) {
      if (offer.bidding && offer.biddingStatus === 1) {
        return 'Bidding not started'
      }
      if (!offer.bidding && !offer.closed) {
        return 'Buy now'
      }
      if (offer.closed) {
        return 'Bought'
      }
      if (offer.bidding && offer.biddingStatus === 2) {
        return 'Bidding in progress'
      }
    },
    async dynamicBid (offer, index) {
      if (this.price > offer.price) {
        try {
          await OffersService.bid({
            offerId: offer._id,
            price: this.price
          })

          this.socket.emit('SEND_BID', {
            bidderId: this.$store.state.user._id,
            bidderName: this.$store.state.user.username,
            price: this.price,
            offerId: offer._id
          })
          this.offers[index].price = this.price
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
      this.offers = (await OffersService.historyBidding()).data
      this.updateVisibleOffers()
    }
  }
}
</script>

<style scoped>
@import '../sass/main.css';
@import '../sass/tables.css';
</style>
