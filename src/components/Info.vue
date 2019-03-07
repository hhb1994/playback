<template>
  <div id="info">
    <span class="info">节目信息</span>
    <span class="text">{{currentChannel}}</span>
    <span class="text">{{currentProgram.date}}&nbsp;</span>
    <span class="text">{{currentProgram.startTime}}</span>
    <span class="text">{{currentProgram.name}}</span>
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
    .text
      font-size 10px
    .info
      font-size 10px
@media screen and (max-height: 750px) and (min-height: 600px)
  #info
    padding 7px
    .text
      font-size 15px
    .info
      font-size 15px
@media screen and (min-height: 750px)
  #info
    padding 10px
    .text
      font-size 20px
    .info
      font-size 20px
#info
  color white
  .info
    padding-top 8px
    padding-bottom 8px
    padding-left 14px
    padding-right 14px
    margin-right 10px
    margin-left 10px
    background-color #333333
    border-radius 20px
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
</style>
