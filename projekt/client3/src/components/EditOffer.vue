<template>
<div class="offer-create">
  Edit offer
  <br />
  <br />
  Title
  <br />
  <input
      class="createInput"
      type="text"
      name="title"
      v-model="offer.title"
      placeholder="Title"
    />
    <br />
    <br />
    Allow bidding
    <input
      type="checkbox"
      name="bidding"
      v-model="offer.bidding"
      placeholder="Bidding"
    />
    <br />
    <br />
    Price
    <br />
    <input
      class="createInput"
      type="number"
      name="price"
      v-model="offer.price"
      placeholder="Price"
    />
    <br />
    <br />
    <button class="createButton"
      @click="save">Save Offer</button>
</div>
</template>

<script>
import OffersService from '@/services/OffersService';

export default {
  data() {
    return {
      offer: {},
    };
  },
  methods: {
    async save() {
      if (this.offer.author === this.$store.state.user._id && !this.offer.closed &&
          (this.offer.biddingStatus === 1 || this.offer.biddingStatus === 3)) {
        try {
          const { offerId } = this.$store.state.route.params;
          await OffersService.put(this.offer);
          this.$router.push({
            name: 'offer',
            params: {
              offerId,
            },
          });
        } catch (err) {
          this.$router.push({
            name: 'offers',
          });
        }
      } else {
        this.$router.push({
          name: 'offers',
        });
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
        const { offerId } = this.$store.state.route.params;
        this.offer = (await OffersService.show(offerId)).data;
        if (this.offer.author != this.$store.state.user._id || this.offer.closed ||
          (this.offer.biddingStatus != 1 && this.offer.biddingStatus != 3)) {
          this.$router.push({
            name: 'offers',
          }); 
        }
      } catch (err) {
        this.$router.push({
          name: 'offers',
        });
      }
    }
  },
};
</script>

<style scoped>
@import '../sass/offer.css';
@import '../sass/main.css'
</style>
