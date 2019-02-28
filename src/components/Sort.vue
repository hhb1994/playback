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
  data() {
    return {
      isTrue: true,
      isFalse: false
    };
  },
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
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: false
      });
      this.$store.commit({
        type: "switchStreamType",
        streamType: streamType
      });
      this.$store.commit({
        type: "changeChannelIndex",
        channelIndex: 0
      });
      if (streamType) {
        this.$store.commit({
          type: "changeStream",
          streamSrc: this.$store.state.initStream,
          streamType: "application/x-mpegURL"
        });

        if (this.isLoginIn) {
          this.$store.commit({
            type: "getCurrentChannel",
            currentChannel: {
              channelName: "浙江卫视高清",
              channelId: 1,
              channelShortName: "zjws"
            }
          });
        }
      } else {
        this.$store.commit({
          type: "changeStream",
          streamSrc: this.$store.state.initStream2,
          streamType: "application/x-mpegURL"
        });

        if (this.isLoginIn) {
          this.$store.commit({
            type: "getCurrentChannel",
            currentChannel: {
              channelName: "浙江之声",
              channelId: 12,
              channelShortName: "fm88"
            }
          });
        }
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
#sort
  width 164px
  background-color black
  margin-left 10px
</style>
<style>
.el-radio-group {
  width: 140px;
  margin-left: 20%;
  margin-bottom: 10px;
  margin-top: 10px;
}
.el-radio-button__inner {
  padding: 8px 12px !important;
}
.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 15px 0 0 15px !important;
}
.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 15px 15px 0 !important;
}
</style>
