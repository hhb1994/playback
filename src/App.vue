<template>
  <div
    id="app"
    v-loading="loading"
    element-loading-text="拼命加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <Header/>
    <div id="container">
      <div>
        <Player/>
      </div>
      <div>
        <Sort/>
        <ChannelList/>
      </div>
      <div v-if="isLoginIn">
        <DatePicker/>
        <ProgramList/>
      </div>
    </div>
    <div class="flex-center">
      <div id="information">
        <div v-if="isLoginIn">
          <Info v-if="!isTimeTravel"/>
          <div v-else>
            <TimeTravel v-if="isVideo"/>
          </div>
        </div>
        <div v-else id="notLogin">登录以查看节目单及当前节目信息</div>
      </div>
    </div>
    <Footer/>
    <el-dialog title="登录监听监看回放系统" :visible.sync="dialogVisible">
      <div id="dialogForm">
        <el-form>
          <el-form-item label="账 户 :" label-width="60px">
            <el-input v-model="username"></el-input>
          </el-form-item>
          <el-form-item label="密 码 :" label-width="60px">
            <el-input v-model="userpwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="help()">忘记密码?</el-button>
            <span>|</span>
            <el-button type="text" @click="help()">无法登陆?</el-button>
          </el-form-item>
          <el-form-item id="buttonGroup">
            <el-button @click="hideDialog()">取 消</el-button>
            <el-button type="primary" @click="login()">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
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
import TimeTravel from "./components/TimeTravel.vue";

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
    Info,
    TimeTravel
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.isDialogVisible;
      },
      set: function() {
        this.$store.commit({ type: "hideDialog" });
      }
    },
    isLoginIn: {
      get: function() {
        return this.$store.state.isLoginIn;
      }
    },
    loading: {
      get: function() {
        return this.$store.state.isLoading;
      }
    },
    isTimeTravel: {
      get: function() {
        return this.$store.state.isTimeTravel;
      }
    },
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
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
    // 帮助
    help() {
      this.actionFailed("请联系融媒体技术中心系统研发部!");
    },
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
              this.actionFailed(
                "登录失败!可能原因:1.账户或者密码错误;2.未开通权限;3.服务器错误"
              );
            } else {
              this.username = "";
              this.userpwd = "";
              let date = new Date();
              let expireMinutes = 120;
              date.setTime(date.getTime() + expireMinutes * 60000);
              document.cookie = `vodToken = ${
                response.data.data.tokenId
              }; expires = ${date.toGMTString()}`;
              document.cookie = `name = ${
                response.data.data.name
              }; expires = ${date.toGMTString()}`;
              this.$store.commit({
                type: "changeLoginInState",
                isLoginIn: true
              });
              this.$store.commit({
                type: "getLoginName",
                loginName: response.data.data.name
              });
              this.$store.commit({
                type: "getAdminState",
                isAdmin: response.data.data.isAdmin
              });
              this.hideDialog();
              this.actionSuccess("登录成功!");
            }
          })
          .catch(error => console.log(error));
      }
    },

    checkCookie() {
      if (
        document.cookie
          .split(";")
          .findIndex(item => item.trim().substring(0, 8) == "vodToken") !== -1
      ) {
        this.$store.commit({
          type: "changeLoginInState",
          isLoginIn: true
        });
      }
    },
    actionSuccess(success) {
      this.$notify({
        title: "SUCCESS",
        message: success,
        type: "success",
        position: "top-left"
      });
    },
    actionFailed(fail) {
      this.$notify.error({
        title: "FAILED",
        message: fail,
        position: "top-left"
      });
    }
  },
  mounted() {
    this.checkCookie();

    console.log("%cMOZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ8M", "color: blue");
    console.log("%cMZZZZZZZZZZZZO7+==?ZZZZZZZZZZZZZZM", "color: blue");
    console.log("%cMZZZZZZZZZ=..        ?ZZZZZZZZZZZM", "color: blue");
    console.log("%cMZZZZZZ?.            :ZZZZZZZ?:.:M", "color: blue");
    console.log("%cMZZZZZ.     .:+.    .ZZZ=.......,M", "color: blue");
    console.log("%cMZZZZ.   .7ZZZZ.   ,$..         ,M", "color: blue");
    console.log("%cMZZZZ..$ZZZZZ,    .   .. ~?7$ZZZZM", "color: blue");
    console.log("%cMZZZZZZZZZZ$.      ,+ZZZZZZZZZZZZM", "color: blue");
    console.log("%cMZZZZZZZZZ+    .?ZZZZZZZZZZZZZZZZM", "color: blue");
    console.log("%cMZZZZZZZZ7  :$ZZZZZZZZZZZZZZZZZZOM", "color: blue");
    console.log("%cMOZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ8M", "color: blue");
    console.log("%c由融媒体技术中心·系统研发部开发", "color:red");
  }
};
</script>
<style lang="stylus" scoped>
@media screen and (max-height: 600px)
  #information
    width 900px
@media screen and (max-height: 750px) and (min-height: 600px)
  #information
    width 1150px
@media screen and (min-height: 750px)
  #information
    width 1390px
#app
  height 100%
  color white
  #container
    margin-top 30px
    display flex
    justify-content center
  #notLogin
    margin-left 10%
    padding-top 10px
  #dialogForm
    width 50%
    margin-left 25%
    #buttonGroup
      margin-left 40%
.flex-center
  display flex
  justify-content center
</style>
