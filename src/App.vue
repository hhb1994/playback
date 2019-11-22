<template>
  <div
    id="app"
    v-loading="loading"
    element-loading-text="拼命加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <Header />
    <div id="container">
      <div>
        <Player />
      </div>
      <div>
        <Sort />
        <ChannelList />
      </div>
      <div>
        <DatePicker />
        <ProgramList />
      </div>
    </div>
    <div class="flex-center">
      <div id="information">
        <transition
          enter-active-class="animated fadeInUp faster"
          leave-active-class="animated fadeOutUp faster"
          mode="out-in"
        >
          <Info v-if="!isTimeTravel" />
          <div v-if="isTimeTravel">
            <TimeTravel v-if="isVideo" />
          </div>
        </transition>
      </div>
    </div>
    <Footer />
    <el-dialog title="登陆监听监看回放系统" :visible.sync="dialogVisible">
      <div id="dialogForm">
        <el-form>
          <el-form-item label="账 户 :" label-width="60px">
            <el-input v-model="username" placeholder="oa 账户名"></el-input>
          </el-form-item>
          <el-form-item label="密 码 :" label-width="60px">
            <el-input v-model="userpwd" type="password" placeholder="oa 密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="help()">忘记密码? |</el-button>
            <el-button type="text" @click="help()">无法登陆?</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" @click="hideDialog()">取 消</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" type="primary" @click="login()">确 定</el-button>
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
import utils from "./utils/utils";

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
      userpwd: ""
    };
  },
  methods: {
    // 帮助
    help() {
      this.$actionFailed("请联系融媒体技术中心系统研发部!");
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
        this.$actionFailed("账户与密码不能为空!");
      } else {
        let username = this.username;
        let password = this.userpwd;
        this.$req
          .login({
            username: username,
            password: password
          })
          .then(response => {
            if (response.code != 200) {
              this.$actionFailed("登录失败!可能原因:1.账户或者密码错误;2.未开通权限;3.服务器错误");
            } else {
              this.username = "";
              this.userpwd = "";
              sessionStorage.setItem("token", response.data.tokenId);
              sessionStorage.setItem("name", response.data.name);
              sessionStorage.setItem("department", response.data.department);
              sessionStorage.setItem("isAdmin", response.data.isAdmin);
              this.$store.commit({
                type: "changeLoginInState",
                isLoginIn: true
              });
              this.$store.commit({
                type: "getAdminState",
                isAdmin: response.data.isAdmin
              });
              this.hideDialog();

              this.$actionSuccess("登录成功!");
            }
          })
          .catch(error => console.log(error));
      }
    },

    checkCookie() {
      if (sessionStorage.getItem("token")) {
        this.$store.commit({
          type: "changeLoginInState",
          isLoginIn: true
        });
      }
    },
    getToken() {
      //这里有两种单点登录的方式,通过蓝云登录可以获取 token 参数,通过 oa 可以获取 sessionid 参数.
      if ((utils.getUrlKey("token") || utils.getUrlKey("sessionid")) && !sessionStorage.getItem("token")) {
        if (utils.getUrlKey("token")) {
          sessionStorage.setItem("sobeyToken", utils.getUrlKey("token"));
          sessionStorage.setItem("siteCode", utils.getUrlKey("siteCode"));
          this.getUserInfo(utils.getUrlKey("token"));
        } else {
          sessionStorage.setItem("oaToken", utils.getUrlKey("sessionid"));
          this.getUserInfo(utils.getUrlKey("sessionid"));
        }
      }
    },
    getUserInfo(token) {
      if (token) {
        let infoBody = {
          session: null,
          token: null
        };
        token.length == 64 ? ((infoBody.token = token), delete infoBody.session) : ((infoBody.session = token), delete infoBody.token);
        this.$req
          .sso(infoBody)
          .then(res => {
            if (res.code == 200) {
              sessionStorage.setItem("token", res.data.tokenId);
              sessionStorage.setItem("name", res.data.name);
              sessionStorage.setItem("department", res.data.department);
              sessionStorage.setItem("isAdmin", res.data.isAdmin);
              this.$actionSuccess("登录成功!");
              this.$store.commit({
                type: "changeLoginInState",
                isLoginIn: true
              });
            } else {
              this.$actionFailed("单点登录失败,请尝试手动登录!");
            }
          })
          .catch(err => console.log(err));
      }
    },
    checkIfIE() {
      if(utils.getExplore(navigator.userAgent)=="IE"){
        this.$actionFailed("为了获得更好的使用体验,请换用现代浏览器😊(推荐使用chrome/Firefox/360浏览器)")
      }
    },
    consoleLogo() {
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
  },
  mounted() {
    this.checkIfIE();
    this.checkCookie();
    this.getToken();
    this.consoleLogo();
  },
  beforeDestroy() {
    sessionStorage.clear();
  },
  created: function() {
    var _this = this;
    document.onkeydown = () => {
      let key = window.event.keyCode;
      if (key == 13 && _this.dialogVisible) {
        _this.login();
      }
    };
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
  height 100vh
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
.flex-center
  display flex
  justify-content center
</style>
