import Vue from "vue";
import {
  Button,
  Notification,
  Dialog,
  Form,
  FormItem,
  Input,
  DatePicker
} from "element-ui";

Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(DatePicker);
Vue.prototype.$notify = Notification;
