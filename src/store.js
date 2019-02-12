import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isVideo: true,
    player: null,
    initStream: "http://10.20.50.127/jtjk/zjwshd04.m3u8",
    initType: "application/x-mpegURL",
    isDialogVisible: false,
    isLoginIn: false,
    date: null,
    currentChannel: []
  },
  mutations: {
    showDialog(state) {
      state.isDialogVisible = true;
    },
    hideDialog(state) {
      state.isDialogVisible = false;
    },
    changeLoginInState(state, payload) {
      state.isLoginIn = payload.isLoginIn;
    },
    getPlayer(state, payload) {
      state.player = payload.player;
    },
    changeStream(state, payload) {
      state.player.src = payload.streamSrc;
      state.player.type = payload.streamType;
    },
    getCurrentChannel(state, payload) {
      state.currentChannel = payload.currentChannel;
    },
    changeDate(state, payload) {
      state.date = payload.date;
    }
  },
  actions: {}
});
