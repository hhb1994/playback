<template>
  <div>
    <div id="videoContainer">
      <div>
        <video
          oncontextmenu="return false"
          controls
          ref="videoPlayer"
          class="video-js vjs-big-play-centered"
        ></video>
      </div>
      <div id="audioCover" v-if="!isVideo"></div>
    </div>
  </div>
</template>
<script>
import videojs from "video.js";
import video_zhCN from "video.js/dist/lang/zh-CN.json";
videojs.addLanguage("zh-CN", video_zhCN);
import { ControlBtn } from "./../plugins/videojs";
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
        sources: this.streamList,
        notSupportedMessage: "此视频暂无法播放，请联系融媒体技术中心系统研发部!",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
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
        let controlBtn = this.player.controlBar.getChild("controlBtn");
        if (controlBtn) {
          this.player.controlBar.removeChild(controlBtn);
        }
        this.player.controlBar.addChild(this.controlBtn);
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
