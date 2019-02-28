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
@media screen and (max-height: 600px)
  #info
    padding 5px
    span
      font-size 10px
@media screen and (max-height: 750px) and (min-height: 600px)
  #info
    padding 7px
    span
      font-size 15px
@media screen and (min-height: 750px)
  #info
    padding 10px
    span
      font-size 20px
#info
  color white
  .el-button
    margin-right 10px
</style>
<style>
@media screen and (max-height: 600px) {
  #travel {
    font-size: 10px;
  }
}
@media screen and (max-height: 750px) and (min-height: 600px) {
  #travel {
    font-size: 15px;
  }
}
@media screen and (min-height: 750px) {
  #travel {
    font-size: 20px;
  }
}

#info .el-button {
  padding: 8px 12px !important;
}
</style>
