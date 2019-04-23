<template>
  <div>
    <div id="videoContainer">
      <div>
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          oncontextmenu="return false"
        ></video-player>
      </div>
      <div id="audioCover" v-if="!isVideo"></div>
    </div>
  </div>
</template>
<script>
import videojs from "video.js";
window.videojs = videojs;
export default {
  name: "Player",
  data() {
    return {
      // 视频播放
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0, 5.0],
        autoplay: true,
        loop: false,
        preload: "auto",
        language: "zh-CN",
        aspectRatio: "16:9",
        fluid: true,
        sources: [
          {
            type: "application/x-mpegURL",
            src: this.$store.state.initStream
          }
        ],
        poster: "",
        notSupportedMessage:
          "此视频暂无法播放，请联系融媒体技术中心系统研发部!",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      }
    };
  },
  computed: {
    player: {
      get: function() {
        return this.$refs.videoPlayer.player;
      }
    },
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
      }
    }
  },
  mounted() {
    this.$store.commit({
      type: "getPlayer",
      player: this.player.options_.sources[0]
    });
  },
  watch: {},
  methods: {}
};
</script>
<style lang="stylus" scoped>
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
</style>
