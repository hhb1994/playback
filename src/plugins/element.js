import Vue from "vue";
import {
  Button,
  ButtonGroup,
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
Vue.use(ButtonGroup);
Vue.prototype.$notify = Notification;