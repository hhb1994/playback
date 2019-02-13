<template>
  <div id="app">
    <Header/>
    <div id="container">
      <div>
        <Player/>
        <Info/>
      </div>
      <div>
        <Sort/>
        <ChannelList/>
      </div>
      <div>
        <DatePicker/>
        <ProgramList/>
      </div>
    </div>
    <Footer/>
    <el-dialog title="登录" :visible.sync="dialogVisible">
      <el-form>
        <el-form-item label="账户名称">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密 码">
          <el-input v-model="userpwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="hideDialog()">取 消</el-button>
          <el-button type="primary" @click="login()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Player from "./components/Player.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ChannelList from "./components/ChannelList.vue";
import ProgramList from "./components/ProgramList.vue";
import DatePicker from "./components/DatePicker.vue";
import Sort from "./components/Sort.vue";
import Info from "./components/Info.vue";

export default {
  name: "app",
  components: {
    Player,
    Header,
    Footer,
    ChannelList,
    ProgramList,
    DatePicker,
    Sort,
    Info
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.isDialogVisible;
      },
      set: function() {
        this.$store.commit({ type: "hideDialog" });
      }
    }
  },
  data() {
    return {
      username: "",
      userpwd: "",
      token: document.cookie.split(";")[0].split("=")[1]
    };
  },
  methods: {
    // 隐藏登录弹框
    hideDialog() {
      this.$store.commit({
        type: "hideDialog"
      });
    },
    // 登录操作
    login() {
      if (this.username == "" || this.userpwd == "") {
        this.actionFailed("账户与密码不能为空!");
      } else {
        let username = this.username;
        let password = this.userpwd;
        this.$axios
          .post(
            "http://10.20.15.165:8080/jtjk/token",
            { username: username, password: password },
            { timeout: 3000 }
          )
          .then(response => {
            if (response.data.code != 200) {
              this.actionFailed("登录失败,可能是由于账号或者密码错误,请重试!");
            } else {
              let date = new Date();
              let expireMinutes = 120;
              date.setTime(date.getTime() + expireMinutes * 60000);
              document.cookie = `token = ${
                response.data.data
              }; expires = ${date.toGMTString()}`;
              this.$store.commit({
                type: "changeLoginInState",
                isLoginIn: true
              });
              this.hideDialog();
              this.actionSuccess("登录成功!");
            }
          })
          .catch(error => console.log(error));
      }
    },
    actionSuccess(success) {
      this.$notify({
        title: "成功",
        message: success,
        type: "success"
      });
    },
    actionFailed(fail) {
      this.$notify.error({
        title: "失败",
        message: fail
      });
    }
  },
  mounted: {
    
  }
};
</script>
<style lang="stylus" scoped>
#app
  #container
    margin-top 30px
    display flex
    justify-content center
</style>
