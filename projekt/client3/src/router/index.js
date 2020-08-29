import Vue from 'vue';
import Router from 'vue-router';
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';
import Offers from '@/components/Offers.vue';
import CreateOffer from '@/components/CreateOffer.vue';
import ViewOffer from '@/components/ViewOffer.vue';
import EditOffer from '@/components/EditOffer.vue';
import History from '@/components/History.vue';
import Bidding from '@/components/Bidding.vue';
import HistoryBidding from '@/components/HistoryBidding.vue';
import Chats from '@/components/Chats.vue';
import ViewChat from '@/components/ViewChat.vue';
import Notifications from '@/components/Notifications.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/offers',
      name: 'offers',
      component: Offers,
    },
    {
      path: '/offers/create',
      name: 'offers-create',
      component: CreateOffer,
    },
    {
      path: '/offers/:offerId',
      name: 'offer',
      component: ViewOffer,
    },
    {
      path: '/offers/:offerId/edit',
      name: 'offer-edit',
      component: EditOffer,
    },
    {
      path: '/offers/:offerId/bidding',
      name: 'offer-bidding',
      component: Bidding,
    },
    {
      path: '/history',
      name: 'history',
      component: History,
    },
    {
      path: '/historyBidding',
      name: 'history-bidding',
      component: HistoryBidding,
    },
    {
      path: '/chats',
      name: 'chats',
      component: Chats,
    },
    {
      path: '/chats/:userId',
      name: 'chat',
      component: ViewChat,
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications,
    },
    {
      path: '*',
      redirect: 'offers',
    },
  ],
});
