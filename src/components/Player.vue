<template>
  <div>
    <div id="videoContainer">
      <div>
        <video controls ref="videoPlayer" class="video-js vjs-big-play-centered"></video>
      </div>
      <div id="audioCover" v-if="!isVideo"></div>
    </div>
  </div>
</template>
<script>
import videojs from "video.js";
// let videojs = require("video.js");
import video_zhCN from "video.js/dist/lang/zh-CN.json";
videojs.addLanguage("zh-CN", video_zhCN);
import { ControlBtn } from "./../plugins/videojs";

// videojs.registerPlugin("ControlButton", ControlButton);
// import videoJsResolutionSwitcher from "videojs-resolution-switcher";
// videojs.registerPlugin("videoJsResolutionSwitcher", videoJsResolutionSwitcher);
// let videoJsResolutionSwitcher = require("videojs-resolution-switcher");
// import { examplePlugin } from "./../plugins/videojs";
export default {
  name: "Player",
  computed: {
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
      }
    },
    streamList() {
      let streamList = [];
      if (this.$store.state.currentChannel.stream) {
        this.$store.state.currentChannel.stream.forEach(item => {
          streamList.push({
            src: item.streamSrc,
            type: item.streamType
          });
        });
      }
      return streamList;
    },
    playerOptions() {
      return {
        playbackRates: [0.7, 1.0, 1.5, 2.0, 5.0],
        autoplay: true,
        loop: false,
        preload: "auto",
        language: "zh-CN",
        aspectRatio: "16:9",
        fluid: true,
        // liveui:true,
        sources: this.streamList,
        // sources: [
        //   { src: "http://10.20.50.127:8081/zjwssd/index.m3u8", type: "application/x-mpegURL", label: 360 },
        //   { src: "http://10.20.50.127:8081/zjws/index.m3u8", type: "application/x-mpegURL", label: 720 }
        // ],
        notSupportedMessage: "此视频暂无法播放，请联系融媒体技术中心系统研发部!",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        },
        plugins: {
          // ControlButton: {}
          // videoJsResolutionSwitcher: {
          // default: 360,
          // dynamicLabel: true
          // }
        },
        bigPlayButton: true
      };
    },
    controlBtn() {
      return new ControlBtn(this.player, this.playerOptions);
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.playerOptions, () => {
      this.player.controlBar.addChild(this.controlBtn);

      setTimeout(() => {
        const controlBar = this.player.getChild("ControlBar");
        console.log(controlBar);
        const btn = this.player.controlBar.getChild("PlayToggle");
        console.log(btn);
      }, 2000);

      // this.player.controlBar.addChild(controlBtn, { text: "hello" });
      // this.player.addChild("TitleBar", { text: "这里是标题" });
      // var Button = videojs.getComponent("button");
      // var button = new Button(this.player, {
      //   clickHandler: function(event) {
      //     videojs.log("Clicked");
      //   }
      // });
      //   this.on("volumechange", () => {
      //     // 音量调整事件
      //     console.log(this.volumn);
      //   });
    });
  },
  methods: {},
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  watch: {
    playerOptions(val) {
      if (this.player) {
        this.player.src(val.sources);
        // this.player.controlBar.removeChild(this.controlBtn);
        // grab ControlBar "component" from your Video.js player
        // this.player.controlBar.addChild(this.controlBtn);

        // const controlBar = this.player.getChild("ControlBar");
        // const btn = controlBar.getChild("ControlBtn");
        // console.log(controlBar);
        // console.log(btn);

        // remove closed caption button
        // controlBar.removeChild(controlBar.getChild("controlBtn"));
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.vjs-test
  font-size 30px
  color red
  z-index 100
#videoContainer
  position relative
#audioCover
  position absolute
  top 0
  left 0
  background-image url('../assets/2.gif')
  background-repeat no-repeat
  background-size cover
@media screen and (max-height: 600px)
  #videoContainer
    height 270px
    width 480px
  #audioCover
    height 230px
    width 480px
@media screen and (max-height: 750px) and (min-height: 600px)
  #videoContainer
    height 405px
    width 720px
  #audioCover
    height 365px
    width 720px
@media screen and (min-height: 750px)
  #videoContainer
    height 540px
    width 960px
  #audioCover
    height 500px
    width 960px
.video-js
  font-size 15px
</style>
