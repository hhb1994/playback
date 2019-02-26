<template>
  <div id="info">
    <el-button type="primary" round>节目信息</el-button>
    <span>{{currentChannel}}</span>
    <span>{{currentProgram.date}}&nbsp;</span>
    <span>{{currentProgram.startTime}}</span>
    <span>{{currentProgram.name}}</span>
    <el-button
      id="travel"
      class="showTimeTravel"
      type="text"
      @click="showTimeTravel()"
      v-show="isVideo"
    >
      直播时移
      <i class="el-icon-arrow-right"></i>
    </el-button>
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
    isVideo: {
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
    margin-left 10px
    margin-right 10px
</style>
<style>
#travel {
  font-size: 20px;
}
</style>
