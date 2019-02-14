<template>
  <div id="header">
    <p>监听监看回放系统</p>
    <span>
      <el-button @click="showDialog()">登录</el-button>
    </span>
  </div>
</template>
<script>
export default {
  name: "Header",
  methods: {
    showDialog() {
      this.$store.commit({ type: "showDialog" });
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
    font-size 24px
    padding-top 14px
    padding-left 40px
    font-weight 700
</style>
