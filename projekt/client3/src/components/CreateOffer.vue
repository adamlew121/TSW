<template>
<div class="offer-create">
  Create offer
  <br />
  <input
      type="text"
      name="title"
      v-model="offer.title"
      placeholder="Title"
    />
    <br />
    Allow bidding
    <input
      type="checkbox"
      name="bidding"
      v-model="offer.bidding"
      placeholder="Bidding"
    />
    <br />
    <input
      type="number"
      name="price"
      v-model="offer.price"
      placeholder="Price"
    />

    <br />
    <button @click="create">Post Offer</button>
</div>
</template>

<script>
import OffersService from '@/services/OffersService';

export default {
  data() {
    return {
      offer: {
        title: null,
        bidding: false,
        price: null,
        author: null,
      },
    };
  },
  methods: {
    async create() {
      try {
        this.offer.author = this.$store.state.user._id;
        await OffersService.post(this.offer);
        this.$router.push({
          name: 'offers',
        });
      } catch (err) {
        this.$router.push({
          name: 'offers',
        });
      }
    },
  },
  mounted() {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers',
      });
    }
  },
};
</script>

<style scoped>
@import '../sass/offer.css'
</style>
