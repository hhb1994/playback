<template>
  <div id="header" class="flex">
    <div>
      <h5>监听监看回放系统</h5>
    </div>
    <div id="buttonGroup">
      <div class="flex">
        <div v-show="!isLoginIn">
          <el-button @click="showDialog()" round>登陆</el-button>
        </div>
        <transition
          enter-active-class="animated fadeInLeft faster"
          leave-active-class="animated fadeOutLeft faster"
        >
          <div v-if="isLoginIn" class="flex">
            <div>
              <p>{{this.name}} - {{this.department}}</p>
            </div>
            <div v-if="isAdmin=='true'">
              <p style="cursor:pointer" @click="manage()">系统管理</p>
            </div>
            <div>
              <el-button @click="logOut()" round>注销</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  computed: {
    isAdmin() {
      return sessionStorage.isAdmin;
    },
    name: function() {
      return sessionStorage.getItem("name");
    },
    department: function() {
      return sessionStorage.getItem("department");
    },
    isLoginIn: {
      get: function() {
        return this.$store.state.isLoginIn;
      }
    }
  },
  methods: {
    showDialog() {
      this.$store.commit({ type: "showDialog" });
    },
    logOut() {
      location.href = location.href.split("?")[0];
      sessionStorage.clear();
    },
    manage() {
      // location.href = `http://jtjk.zrtg.com:10080?token=${sessionStorage.getItem("token")}`;
      window.open(`http://jtjk.zrtg.com:10080?token=${sessionStorage.getItem("token")}`,"_blank")
    }
  }
};
</script>
<style lang="stylus" scoped>
#header
  width 100%
  height 60px
  background-color #409EFF
  color white
  position relative
  p
    font-weight bold
    font-size 16px
    padding-top 7px
    margin-right 10px
  h5
    width 200px
    font-size 24px
    padding-top 14px
    padding-left 40px
    font-weight 700
.flex
  display flex
  #buttonGroup
    position absolute
    top 15px
    right 200px
</style>
<style>
#header .el-button {
  padding: 8px 18px !important;
}
</style>
