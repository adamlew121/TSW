<template>
<div class="offer-create">
  Offer Details
  <hr/>
  <p>
    {{offer.title}}
  </p>
  <p>
    {{canEnterBidding ? '' : offer.price + ' USD'}}
  </p>
  <p>
  Created by {{author.username}}
  </p>
  <div v-if="canBuy">
    <br>Buy now
  </div>
  <div v-if="canEnterBidding">
    <br>Bidding in progress
  </div>
  <div v-if="canStartBidding">
    <br>Click button to start bidding
  </div>
  <div v-if="canFinishBidding">
    <br>Click button to finish bidding
  </div>

    <hr/>
      <div v-if="!isAuthor(offer) && isLoggedIn()">
      <button class="createButton"
      @click="navigateTo({
        name: 'chat',
        params: {
          userId: offer.author
        }
      })">
      Chat with creator
      </button>
      </div>
    <br />
    <div v-if="offer.closed && !buyer">
      Offer canceled
    </div>
    <div v-if="offer.closed && buyer">
      Already bought by {{buyer.username}}
    </div>

    <div v-if="canEdit">
    <button class="createButton"
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
      <button class="createButton"
      @click="buy">
        Buy Offer
      </button>
    </div>

    <div v-if="canStartBidding">
      <button class="createButton"
      @click="startBid">
        Start Bidding
      </button>
    </div>

    <div v-if="canFinishBidding">
      <button class="createButton"
      @click="finishBid">
        Finish
      </button>
    </div>

    <div v-if="canEnterBidding">
      <bidding :offerId="offer._id" />
    </div>

</div>
</template>

<script>
import Bidding from '@/components/Bidding.vue';
import OffersService from '@/services/OffersService';
import AuthenticationService from '@/services/AuthenticationService';

export default {
  components: {
    Bidding,
  },
  data() {
    return {
      offer: {},
      author: '',
      buyer: null,
      canBuy: false,
      canEdit: false,
      canStartBidding: false,
      canFinishBidding: false,
      canEnterBidding: false,
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    async buy() {
      try {
        await OffersService.buy(this.offer);
        this.offer.closed = true;
        this.canBuy = false;
        this.buyer = this.$store.state.user;
      } catch (err) {
        this.$router.push({
          name: 'offers',
        });
      }
    },
    async startBid() {
      try {
        const offer = (await OffersService.start(this.offer)).data;
        this.offer = offer;
        this.canStartBidding = false;
        this.canFinishBidding = true;
        this.canEdit = false;
      } catch (err) {
        this.$router.push({
          name: 'offers',
        });
      }
    },
    async finishBid() {
      try {
        const offer = (await OffersService.finish(this.offer)).data;
        this.offer = offer;
        this.canFinishBidding = false;
        this.canEdit = false;
      } catch (err) {
        this.$router.push({
          name: 'offers',
        });
      }
    },
    isAuthor(offer) {
      return this.$store.state.isUserLoggedIn && offer.author === this.$store.state.user._id;
    },
    isLoggedIn() {
      return this.$store.state.isUserLoggedIn;
    },
  },
  async mounted() {
    const { offerId } = this.$store.state.route.params;
    this.offer = (await OffersService.show(offerId)).data;
    this.author = (await AuthenticationService.show(this.offer.author)).data;
    if (this.offer.buyer) {
      this.buyer = (await AuthenticationService.show(this.offer.buyer)).data;
    }

    if (this.$store.state.isUserLoggedIn) {
      if (this.offer.author === this.$store.state.user._id
        && !this.offer.closed && this.offer.biddingStatus === 1) {
        this.canEdit = true;
      } else {
        this.canEdit = false;
      }

      if (this.offer.author === this.$store.state.user._id
        && !this.offer.closed && this.offer.bidding === true) {
        if (this.offer.biddingStatus === 1) {
          this.canStartBidding = true;
        }
        if (this.offer.biddingStatus === 2) {
          this.canFinishBidding = true;
        }
      }

      if (this.offer.author === this.$store.state.user._id
        && !this.offer.closed && !this.offer.bidding) {
          this.canFinishBidding = true;        
        }


      if (this.$store.state.isUserLoggedIn === true && !this.offer.closed
        && this.offer.bidding === true && this.offer.biddingStatus === 2) {
        this.canEnterBidding = true;
        console.log('can enter');
      } else {
        console.log('cant enter');
        // console.log(this.$store.isUserLoggedIn);
        // console.log(!this.offer.closed);
        // console.log(this.offer.bidding === true);
        // console.log(this.offer.biddingStatus === 2);
        // console.log(this.$store);

      }

      if (this.offer.author !== this.$store.state.user._id
        && !this.offer.closed && this.offer.bidding === false) {
        this.canBuy = true;
      } else {
        this.canBuy = false;
      }
    }
  },
};
</script>

<style scoped>
@import '../sass/offer.css'
</style>
