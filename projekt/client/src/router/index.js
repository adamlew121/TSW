import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Offers from '@/components/Offers'
import CreateOffer from '@/components/CreateOffer'
import ViewOffer from '@/components/ViewOffer'
import EditOffer from '@/components/EditOffer'
import History from '@/components/History'
import Bidding from '@/components/Bidding'
import HistoryBidding from '@/components/HistoryBidding'
import Chats from '@/components/Chats'
import ViewChat from '@/components/ViewChat'
import Notifications from '@/components/Notifications'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/offers',
      name: 'offers',
      component: Offers
    },
    {
      path: '/offers/create',
      name: 'offers-create',
      component: CreateOffer
    },
    {
      path: '/offers/:offerId',
      name: 'offer',
      component: ViewOffer
    },
    {
      path: '/offers/:offerId/edit',
      name: 'offer-edit',
      component: EditOffer
    },
    {
      path: '/offers/:offerId/bidding',
      name: 'offer-bidding',
      component: Bidding
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/historyBidding',
      name: 'history-bidding',
      component: HistoryBidding
    },
    {
      path: '/chats',
      name: 'chats',
      component: Chats
    },
    {
      path: '/chats/:userId',
      name: 'chat',
      component: ViewChat
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications
    },
    {
      path: '*',
      redirect: 'offers'
    }
  ]
})
