<template>
  <div id="header" class="flex">
    <div>
      <h5>监听监看回放系统</h5>
    </div>
    <div id="buttonGroup">
      <div class="flex">
        <div v-show="!isLoginIn">
          <el-button @click="showDialog()" round>登录</el-button>
        </div>
        <transition
          enter-active-class="animated fadeInLeft faster"
          leave-active-class="animated fadeOutLeft faster"
        >
          <div v-if="isLoginIn" class="flex">
            <div>
              <p>当前登录用户:{{this.existName}}</p>
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
    name: function() {
      return sessionStorage.getItem("name");
    },
    isLoginIn: {
      get: function() {
        return this.$store.state.isLoginIn;
      }
    },
    loginName: {
      get: function() {
        return this.$store.state.loginName;
      }
    },
    existName() {
      return this.loginName == null ? this.name : this.loginName;
    }
  },
  methods: {
    showDialog() {
      this.$store.commit({ type: "showDialog" });
    },
    logOut() {
      sessionStorage.clear();
      location.reload();
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
    font-size 15px
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
