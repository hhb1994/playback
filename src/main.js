import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import moment from "moment";
//视频播放插件
import VueVideoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import "videojs-contrib-hls";
//elementUI 引入
import "./plugins/element.js";
//axios 引入
import axios from "axios";
Vue.use(axios);
Vue.prototype.$axios = axios;

Vue.use(VueVideoPlayer);

Vue.prototype.$moment = moment;

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
