<template>
<div class="offer-create">
  Edit offer
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
    <button @click="save">Save Offer</button>
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
      if (this.offer.author === this.$store.state.user._id) {
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
@import '../sass/offer.css'
</style>
