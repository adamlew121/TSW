<template>
<div class="main-app">

  <div class="cstGrid" >
    <div class="cstGridField" v-for="(offer) in visibleOffers" :key="offer.id" @click="navigateTo({
        name: 'offer',
        params: {
          offerId: offer._id
          }
        })">
      {{isAuthor(offer) ? 'AUTHOR' : ''}} {{!isAuthor(offer) && offer.closed ? 'CLOSED' : ''}}
      {{!isAuthor(offer) && !offer.closed ? 'OPEN' : ''}} <br/>
      {{offer.title}} <br/>
      {{offer.price}} USD <br/>
      {{getOption(offer)}} <br/>
    </div>
  </div>
  <div v-if="totalPages() > 0" class="pagination">
    <span v-if="showPreviousLink()"
      class="pagination-btn" v-on:click="updatePage(currentPage - 1)"> &lt;
    </span>
    {{ currentPage + 1 }} of {{ totalPages() }}
    <span v-if="showNextLink()"
      class="pagination-btn" v-on:click="updatePage(currentPage + 1)"> &gt;
    </span>
  </div>
</div>
</template>

<script>
import OffersService from '@/services/OffersService';

export default {
  data() {
    return {
      offers: {},
      visibleOffers: {},
      currentPage: 0,
      pageSize: 5,
      
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    updateVisibleOffers() {
      this.visibleOffers = this.offers.slice(this.currentPage * this.pageSize,
        (this.currentPage * this.pageSize) + this.pageSize);

      if (this.visibleOffers.length === 0 && this.currentPage > 0) {
        this.updatePage(this.currentPage - 1);
      }
    },
    updatePage(pageNumber) {
      this.currentPage = pageNumber;
      this.updateVisibleOffers();
    },
    totalPages() {
      return Math.ceil(this.offers.length / this.pageSize);
    },
    showPreviousLink() {
      return this.currentPage !== 0;
    },
    showNextLink() {
      return this.currentPage !== (this.totalPages() - 1);
    },
    isAuthor(offer) {
      return this.$store.state.isUserLoggedIn && offer.author === this.$store.state.user._id;
    },
    getOption(offer) {
      if (offer.bidding && offer.biddingStatus === 1) {
        return 'Bidding not started';
      }
      if (!offer.bidding && !offer.closed) {
        return 'Buy now';
      }
      if (offer.closed) {
        return 'Bought';
      }
      if (offer.bidding && offer.biddingStatus === 2) {
        return 'Bidding in progress';
      }
      return 'Unknown status';
    },
  },
  async mounted() {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers',
      });
    } else {
      this.offers = (await OffersService.history()).data;
      this.updateVisibleOffers();
    }
  },
};
</script>

<style scoped>
@import '../sass/main.css';
@import '../sass/tables.css';
</style>
