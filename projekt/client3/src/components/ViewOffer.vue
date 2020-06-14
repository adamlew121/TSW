<template>
<div class="offer-create">
  <h1>Offer Details</h1>
  <hr/>
  <p>
    Title:   {{offer.title}}
  </p>
  <p>
    Price:   {{offer.price}}
  </p>
  <p>
   Is bidding enabled:   {{offer.bidding}}
  </p>
    Creator: {{author.username}}
    <hr/>
      <div v-if="!isAuthor(offer) && isLoggedIn()">
      <button @click="navigateTo({
        name: 'chat',
        params: {
          userId: offer.author
        }
      })">
      Chat with creator
      </button>
      </div>
    <br />
    <div v-if="offer.closed">
      Already bought
    </div>

    <div v-if="canEdit">
    <button
    @click="navigateTo({
      name: 'offer-edit',
      params: {
        offerId: offer._id
        }
      })">
      Edit Offer
      </button>
    </div>

    <div v-if="canBuy">
      <button @click="buy">
        Buy Offer
      </button>
    </div>

    <div v-if="canStartBidding">
      <button @click="startBid">
        Start Bidding
      </button>
    </div>

    <div v-if="canFinishBidding">
      <button @click="finishBid">
        Finish Bidding
      </button>
    </div>

    <div v-if="canEnterBidding">
      <bidding :offerId="offer._id" />
      <button @click="navigateTo({
        name: 'offer-bidding',
        params: {
          offerId: offer._id
        }
      })">
      Enter Bidding
      </button>
    </div>

</div>
</template>

<script>
import Bidding from '@/components/Bidding'
import OffersService from '@/services/OffersService'
import AuthenticationService from '@/services/AuthenticationService'
export default {
  components: {
    Bidding
  },
  data () {
    return {
      offer: {},
      author: '',
      canBuy: false,
      canEdit: false,
      canStartBidding: false,
      canFinishBidding: false,
      canEnterBidding: false
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    async buy () {
      try {
        await OffersService.buy(this.offer)
        this.offer.closed = true
        this.canBuy = false
      } catch (err) {
        console.log(err)
      }
    },
    async startBid () {
      try {
        const offer = (await OffersService.start(this.offer)).data
        this.offer = offer
        this.canStartBidding = false
        this.canFinishBidding = true
      } catch (err) {
        console.log(err)
      }
    },
    async finishBid () {
      try {
        const offer = (await OffersService.finish(this.offer)).data
        this.offer = offer
        this.canFinishBidding = false
      } catch (err) {
        console.log(err)
      }
    },
    isAuthor (offer) {
      return this.$store.state.isUserLoggedIn && offer.author === this.$store.state.user._id
    },
    isLoggedIn () {
      return this.$store.state.isUserLoggedIn
    }
  },
  async mounted () {
    const offerId = this.$store.state.route.params.offerId
    this.offer = (await OffersService.show(offerId)).data
    console.log(this.offer)
    this.author = (await AuthenticationService.show(this.offer.author)).data

    if (this.$store.state.isUserLoggedIn) {
      if (this.offer.author === this.$store.state.user._id && !this.offer.closed && this.offer.biddingStatus === 1) {
        console.log('can edit')
        this.canEdit = true
      } else {
        console.log('cant edit')
        this.canEdit = false
      }

      if (this.offer.author === this.$store.state.user._id && !this.offer.closed && this.offer.bidding === true) {
        if (this.offer.biddingStatus === 1) {
          this.canStartBidding = true
        }
        if (this.offer.biddingStatus === 2) {
          this.canFinishBidding = true
        }
      }

      if (this.offer.author !== this.$store.state.user._id && !this.offer.closed && this.offer.bidding === true && this.offer.biddingStatus === 2) {
        this.canEnterBidding = true
      }

      if (this.offer.author !== this.$store.state.user._id && !this.offer.closed && this.offer.bidding === false) {
        console.log('can buy')
        this.canBuy = true
      } else {
        console.log('cant buy')
        this.canBuy = false
      }
      console.log('can edit: ' + this.canEdit)
      console.log('can buy: ' + this.canBuy)
    }
  }
}
</script>

<style scoped>
@import '../sass/offer.css'
</style>
