<template>
  <div id="info">
    <span class="info">节目信息</span>
    <span class="text">{{currentChannel}}</span>
    <span class="text">{{currentProgram.date}}&nbsp;</span>
    <span class="text">{{currentProgram.startTime}}</span>
    <span class="text">{{currentProgram.name}}</span>
    <el-button
      style="margin-left:10px"
      id="travel"
      class="showTimeTravel"
      type="text"
      @click="showTimeTravel()"
      v-show="isVideo"
    >
      时移
      <i class="el-icon-arrow-right"></i>
    </el-button>
    <a class="download" v-if="isLoginIn && downloadable && isFile" :href="fileUrl" download>下载
      <i class="el-icon-download"></i>
    </a>
  </div>
</template>
<script>
export default {
  name: "Info",
  computed: {
    fileUrl: function() {
      return this.currentProgram.resourceUrl;
    },
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
    },
    isLoginIn: {
      get: function() {
        return this.$store.state.isLoginIn;
      }
    },
    downloadable: {
      get: function() {
        return this.$store.state.downloadable;
      }
    },
    player: {
      get: function() {
        return this.$store.state.player;
      }
    },
    isFile: function() {
      if (this.player.type == "video/mp4" || this.player.type == "audio/mp3") {
        return true;
      } else {
        return false;
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
a
  text-decoration none
  color #419eff
  font-weight 600
@media screen and (max-height: 600px)
  #info
    padding 5px
    .text
      font-size 10px
    .info
      font-size 10px
    .download
      font-size 10px
@media screen and (max-height: 750px) and (min-height: 600px)
  #info
    padding 7px
    .text
      font-size 15px
    .info
      font-size 15px
    .download
      font-size 15px
@media screen and (min-height: 750px)
  #info
    padding 10px
    .text
      font-size 20px
    .info
      font-size 20px
    .download
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
  .download
    margin-left 10px
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
