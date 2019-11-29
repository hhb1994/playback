import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import moment from "moment";
import "video.js/dist/video-js.css";
import "./plugins/element.js";
import { actionSuccess, actionFailed } from "./utils/action";
//引入封装的 api
import {req} from "./http/api";
Vue.prototype.$req = req;
import animated from "animate.css";
Vue.use(animated);
Vue.prototype.$moment = moment;
Vue.prototype.$actionSuccess = actionSuccess;
Vue.prototype.$actionFailed = actionFailed;
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
