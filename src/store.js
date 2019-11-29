import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isVideo: true,
    videoStream: [],
    audioStream: [],
    isDialogVisible: false,

    isLoginIn: false,
    isAdmin: false,

    date: null,
    currentChannel: {},
    currentProgram: [],
    timeTravelProgram: [],

    channelIndex: 0,
    programIndex: 0,

    isLoading: false,
    isTimeTravel: false,
    streamToDestory: {}
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
    // 获取所有视频直播流
    getAllVideoStream(state, payload) {
      state.videoStream = payload.videoStream;
    },
    // 获取所有音频直播流
    getAllAudioStream(state, payload) {
      state.audioStream = payload.audioStream;
    },
    // 改变登录状态
    changeLoginInState(state, payload) {
      state.isLoginIn = payload.isLoginIn;
    },
    //检查是否为管理员
    getAdminState(state, payload) {
      state.isAdmin = payload.isAdmin;
    },

    // 获取当前要播放的频道
    getCurrentChannel(state, payload) {
      state.currentChannel = payload.currentChannel;
    },

    //修改当前播放频道的播放源(播放文件)
    changeCurrentChannelType(state, payload) {
      state.currentChannel.stream = payload.fileInfo;
    },

    //获取当前正在播放的节目
    getCurrentProgram(state, payload) {
      state.currentProgram = payload.currentProgram;
    },
    //获取当前需要时移的节目
    getTimeTravelProgram(state, payload) {
      state.timeTravelProgram = payload.timeTravelProgram;
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
    },
    //更改是否是时移状态
    changeTimeTravelState(state, payload) {
      state.isTimeTravel = payload.isTimeTravel;
    },
    // 获取待销毁的直播流
    getStreamToDestory(state, payload) {
      state.streamToDestory.streamUri = payload.uri;
      state.streamToDestory.shortName = payload.shortName;
    }
  }
});
