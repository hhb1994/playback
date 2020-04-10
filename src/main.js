/*
 * @Author: 韩宏斌
 * @Description: this is the description
 * @version: 1.0.0
 * @LastEditors: 韩宏斌
 * @Date: 2019-03-18 15:54:30
 * @LastEditTime: 2020-04-03 13:38:42
 * @FilePath: /playback/src/main.js
 */
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "video.js/dist/video-js.css";
import "./plugins/element.js";
import { actionSuccess, actionFailed, info } from "./utils/action";
//引入封装的 api
import { req } from "./http/api";
Vue.prototype.$req = req;
import "animate.css";

import dayjs from "dayjs";
Vue.prototype.$moment = dayjs;


Vue.prototype.$actionSuccess = actionSuccess;
Vue.prototype.$actionFailed = actionFailed;
Vue.prototype.$info = info;
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
