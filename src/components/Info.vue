<template>
  <div id="info">
    <span class="info">节目信息</span>
    <span class="text">{{currentChannel.channelName}}</span>
    <span class="text">{{currentProgram.date}}&nbsp;</span>
    <span class="text">{{currentProgram.startTime}}</span>
    <span class="text">{{currentProgram.name}}</span>
    <el-button
      style="margin-left:10px"
      id="travel"
      class="showTimeTravel"
      type="text"
      @click="showTimeTravel()"
      v-show="isVideo&&!isFile"
    >
      时移
      <i class="el-icon-arrow-right"></i>
    </el-button>
    <el-button class="download" type="text" v-if="isFile && isLoginIn" @click="verifyDownload()">
      <i class="el-icon-download"></i>下载
    </el-button>
    <el-dialog :visible.sync="downloadVisible" title="选择下载文件清晰度">
      <el-button
        :disabled="this.streamList.length==1"
        @click="downloadFile(currentProgram.resourceUrl)"
      >高清</el-button>
      <el-button @click="downloadFile(sdFileUrl)">标清</el-button>
    </el-dialog>
  </div>
</template>
<script>
import utils from "./../utils/utils";
export default {
  name: "Info",
  data() {
    return {
      downloadVisible: false
    };
  },
  computed: {
    streamList() {
      if (this.isVideo) {
        if (this.$store.state.videoStream[this.$store.state.channelIndex]) {
          return this.$store.state.videoStream[this.$store.state.channelIndex].stream;
        } else {
          return [];
        }
      } else {
        if (this.$store.state.audioStream[this.$store.state.channelIndex]) {
          return this.$store.state.audioStream[this.$store.state.channelIndex].stream;
        } else {
          return [];
        }
      }
    },
    sdFileUrl() {
      let fileUrl = this.currentProgram.resourceUrl;
      if (this.streamList.length == 2) {
        fileUrl = fileUrl.replace(this.streamList[0].channelShortName, this.streamList[1].channelShortName);
      }
      return fileUrl;
    },
    currentChannel: {
      get: function() {
        return this.$store.state.currentChannel;
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
    isFile: function() {
      if (this.currentChannel.stream) {
        return this.currentChannel.stream[0].streamType == "application/x-mpegURL" ? false : true;
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
    },
    verifyDownload() {
      this.$req
        .verifyPermission(this.currentChannel.stream[0].channelShortName)
        .then(res => {
          if (res.code !== 200) {
            this.$actionFailed("您没有下载此频道节目的权限");
          } else {
            this.downloadVisible = true;
            // utils.downloadFile(this.currentProgram.resourceUrl);
          }
        })
        .catch(() => {
          this.$actionFailed("请求权限信息超时或出错!");
        });
    },
    downloadFile(url) {
      utils.downloadFile(url);
      this.downloadVisible = false;
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
