<template>
  <div id="header" class="flex">
    <div>
      <p>监听监看回放系统</p>
    </div>
    <div id="buttonGroup">
      <el-button @click="showDialog()" v-if="!isLoginIn" round>登录</el-button>
      <el-button @click="logOut()" v-else round>注销</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      token: document.cookie.split(";")[0].split("=")[1]
    };
  },
  computed: {
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
      let date = new Date();
      date.setTime(date.getTime() - 10000);
      document.cookie = "token=''; expires=" + date.toGMTString();
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
  p 
    width 200px
    font-size 24px
    padding-top 14px
    padding-left 40px
    font-weight 700
.flex
  display flex
  #buttonGroup
    margin-left 35%
    padding-left 35%
    margin-top 15px
</style>
<style>
#header .el-button {
  padding: 8px 18px !important;
}
</style>
