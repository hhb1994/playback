<template>
  <div id="sort">
    <el-radio-group id="sortradio" :value="isVideo">
      <el-radio-button :label="true" type="primary" round @click.native="switchStreamType(true)">电视</el-radio-button>
      <el-radio-button
        :label="false"
        type="primary"
        round
        @click.native="switchStreamType(false)"
      >广播</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  name: "Sort",
  computed: {
    isLoginIn: {
      get: function() {
        return this.$store.state.isLoginIn;
      }
    },
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
      }
    }
  },
  methods: {
    switchStreamType(streamType) {
      //去除时移状态
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: false
      });
      //切换直播源信息
      this.$store.commit({
        type: "switchStreamType",
        streamType: streamType
      });
      //切换节目 index
      this.$store.commit({
        type: "changeChannelIndex",
        channelIndex: 0
      });
      //切换直播流
      let currentChannel = streamType ? this.$store.state.videoStream[0] : this.$store.state.audioStream[0];
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: currentChannel
      });
      // if (streamType) {
      //   this.$store.commit({
      //     type: "changeStream",
      //     streamSrc: this.$store.state.initStream,
      //     streamType: "application/x-mpegURL"
      //   });
      //   this.$store.commit({
      //     type: "getCurrentChannel",
      //     currentChannel: {
      //       channelName: "浙江卫视标清",
      //       channelId: 1,
      //       channelShortName: "zjws"
      //     }
      //   });
      // } else {
      //   this.$store.commit({
      //     type: "changeStream",
      //     streamSrc: this.$store.state.initStream2,
      //     streamType: "application/x-mpegURL"
      //   });

      //   this.$store.commit({
      //     type: "getCurrentChannel",
      //     currentChannel: {
      //       channelName: "浙江之声",
      //       channelId: 27,
      //       channelShortName: "fm88"
      //     }
      //   });
      // }
    }
  }
};
</script>
<style lang="stylus" scoped>
#sort
  width 164px
  border-top-left-radius 25px
  background-color black
  margin-left 10px
</style>
<style>
.el-radio-group {
  width: 120px;
  margin-left: 6%;
  margin-bottom: 10px;
  margin-top: 10px;
}
#sort .el-radio-button__inner {
  padding: 8px 12px !important;
}
#sort .el-radio-button.is-active .el-radio-button__inner {
  background-color: #419eff;
  border: 1px solid #419eff;
  color: white;
}
#sort .el-radio-button .el-radio-button__inner {
  background-color: rgb(31, 31, 31);
  border: 1px solid rgb(31, 31, 31);
  color: white;
}
#sort .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 15px 0 0 15px !important;
}
#sort .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 15px 15px 0 !important;
}
</style>
