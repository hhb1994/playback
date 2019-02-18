<template>
  <div id="info">
    <el-button type="primary" round>节目信息</el-button>
    <span>{{currentChannel}}</span>
    <span>{{currentProgram.date}}</span>
    <span>{{currentProgram.startTime}}</span>
    <span>{{currentProgram.name}}</span>
    <el-button class="showTimeTravel" round @click="showTimeTravel()" v-if="isVideo">直播时移<i class="el-icon-arrow-right"></i></el-button>
  </div>
</template>
<script>
export default {
  name: "Info",
  computed: {
    currentChannel: {
      get: function() {
        return this.$store.state.currentChannel.channelName;
      }
    },
    currentProgram: {
      get: function() {
        return this.$store.state.currentProgram;
      }
    },
    isVideo:{
      get: function() {
        return this.$store.state.isVideo;
      }
    }
  },
  methods: {
    showTimeTravel() {
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: true
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
#info
  color white
  padding 10px
  .el-button
    margin-right 10px
  .showTimeTravel
    margin-left 20px
</style>
