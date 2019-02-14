<template>
  <div id="sort">
    <el-button-group>
      <el-button type="primary" round @click="switchStreamType(true)">电视</el-button>
      <el-button type="primary" round @click="switchStreamType(false)">广播</el-button>
    </el-button-group>
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
    }
  },
  methods: {
    switchStreamType(streamType) {
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
  background-color black
  margin-left 10px
  padding-left 20px
</style>
