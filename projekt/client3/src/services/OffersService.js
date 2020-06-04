import Api from '@/services/Api'

export default {
  index () {
    return Api().get('offers')
  },
  history () {
    return Api().get('history')
  },
  historyBidding () {
    return Api().get('historyBidding')
  },
  post (offer) {
    return Api().post('offers', offer)
  },
  show (offerId) {
    return Api().get(`offers/${offerId}`)
  },
  put (offer) {
    return Api().put(`offers/${offer._id}`, offer)
  },
  buy (offer) {
    return Api().put(`offers/${offer._id}/buy`, offer)
  },
  start (offer) {
    return Api().put(`offers/${offer._id}/start`, offer)
  },
  finish (offer) {
    return Api().put(`offers/${offer._id}/finish`, offer)
  },
  bid (data) {
    return Api().put(`offers/${data.offerId}/bid`, {price: data.price})
  },
  indexBids (offerId) {
    return Api().get(`offers/${offerId}/bids`)
  }

}
