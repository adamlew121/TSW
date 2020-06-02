<template>
<div>
  <h3>Offer Metadata</h3>
  <input
      type="text"
      name="title"
      v-model="offer.title"
      placeholder="Title"
    />
    <br />
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
import OffersService from '@/services/OffersService'
export default {
  data () {
    return {
      offer: {}
    }
  },
  methods: {
    async save () {
      if (this.offer.author === this.$store.state.user._id) {
        try {
          const offerId = this.$store.state.route.params.offerId
          console.log('offerId => ' + offerId)
          await OffersService.put(this.offer)
          this.$router.push({
            name: 'offer',
            params: {
              offerId: offerId
            }
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log('tylko autor moze editowac')
        console.log(this.offer.author + ' != ' + this.$store.state.user._id)
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
        const offerId = this.$store.state.route.params.offerId
        this.offer = (await OffersService.show(offerId)).data
        console.log(this.offer)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped></style>
