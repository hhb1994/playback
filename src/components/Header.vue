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
        <div v-if="isLoginIn">
          <p>当前登录用户:{{this.existName}}</p>
        </div>
        <div v-if="isLoginIn">
          <span>
            <el-button @click="logOut()" round>注销</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      name: document.cookie
        .split(";")
        [
          document.cookie
            .split(";")
            .findIndex(item => item.trim().substring(0, 4) == "name")
        ].split("=")[1]
    };
  },
  computed: {
    token: function() {
      if (
        document.cookie
          .split(";")
          .findIndex(item => item.trim().substring(0, 8) == "vodToken") != -1
      ) {
        return document.cookie
          .split(";")
          [
            document.cookie
              .split(";")
              .findIndex(item => item.trim().substring(0, 8) == "vodToken")
          ].split("=")[1];
      } else {
        return undefined;
      }
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
      let date = new Date();
      date.setTime(date.getTime() - 10000);
      document.cookie = "vodToken=''; expires=" + date.toGMTString();
      document.cookie = "name=''; expires=" + date.toGMTString();
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
