import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isVideo: true,
    player: null,
    initStream: "http://10.20.50.127:8081/hnws/20190215041212.m3u8",
    initStream2: "http://10.20.50.127/fm88_audio/128k.m3u8",
    isDialogVisible: false,

    isLoginIn: false,

    date: null,
    currentChannel: [],
    currentProgram: [],

    channelIndex: 0,
    programIndex: 0,

    isLoading: false
  },
  mutations: {
    // 登录弹出框显示
    showDialog(state) {
      state.isDialogVisible = true;
    },
    // 登录弹出框隐藏
    hideDialog(state) {
      state.isDialogVisible = false;
    },
    // 改变登录状态
    changeLoginInState(state, payload) {
      state.isLoginIn = payload.isLoginIn;
    },
    // 获取播放器
    getPlayer(state, payload) {
      state.player = payload.player;
    },
    // 改变播放源格式和链接
    changeStream(state, payload) {
      state.player.src = payload.streamSrc;
      state.player.type = payload.streamType;
    },
    // 获取当前要播放的频道
    getCurrentChannel(state, payload) {
      state.currentChannel = payload.currentChannel;
    },
    //获取当前正在播放的节目
    getCurrentProgram(state, payload) {
      state.currentProgram = payload.currentProgram;
    },
    // 获取当前日期
    changeDate(state, payload) {
      state.date = payload.date;
    },
    // 切换电视/广播
    switchStreamType(state, payload) {
      state.isVideo = payload.streamType;
    },
    // 更改频道class
    changeChannelIndex(state, payload) {
      state.channelIndex = payload.channelIndex;
    },
    // 更改节目class
    changeProgramIndex(state, payload) {
      state.programIndex = payload.programIndex;
    },
    // 更改 loading 状态
    changeLoadingState(state, payload) {
      state.isLoading = payload.isLoading;
    }
  },
  actions: {}
});
