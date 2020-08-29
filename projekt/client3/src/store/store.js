import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
  },
  mutations: {
    login(state, user) {
      state.user = user;
      state.isUserLoggedIn = true;
    },
    logout(state) {
      sessionStorage.clear();
      state.user = null;
      state.isUserLoggedIn = false;
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
  },
});
