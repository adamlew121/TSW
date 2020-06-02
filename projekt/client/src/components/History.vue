<template>
<div>

    <div v-for="offer in visibleOffers" :key="offer.id">
    {{offer.title}}
    {{offer.price}}
    {{offer.bidding}}
    {{offer.author}}
    /// {{offer._id}}
    <button
    @click="navigateTo({
      name: 'offer',
      params: {
        offerId: offer._id
        }
      })">
      View Offer
      </button>
      <div v-if="totalPages() > 0" class="pagination-wrapper">
    <span v-if="showPreviousLink()" class="pagination-btn" v-on:click="updatePage(currentPage - 1)"> &lt; </span>
    {{ currentPage + 1 }} of {{ totalPages() }}
    <span v-if="showNextLink()" class="pagination-btn" v-on:click="updatePage(currentPage + 1)"> &gt; </span>
  </div>
  </div>
</div>
</template>

<script>
import OffersService from '@/services/OffersService'
export default {
  data () {
    return {
      offers: {},
      visibleOffers: {},
      currentPage: 0,
      pageSize: 5
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
    }
  },
  async mounted () {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers'
      })
    } else {
      this.offers = (await OffersService.history()).data
      this.updateVisibleOffers()
    }
  }
}
</script>

<style scoped></style>
