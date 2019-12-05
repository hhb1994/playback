import Vue from "vue";
import {
  Button,
  ButtonGroup,
  Notification,
  Dialog,
  Form,
  FormItem,
  Input,
  DatePicker,
  Slider,
  Loading,
  RadioButton,
  RadioGroup,
  MessageBox,
  Radio
} from "element-ui";

Vue.use(Button);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(ButtonGroup);
Vue.use(Slider);
Vue.use(Loading);
Vue.use(Radio);
Vue.prototype.$notify = Notification;
Vue.prototype.$messageBox = MessageBox;
