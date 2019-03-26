<template>
  <div>
    <div id="videoContainer">
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        @waiting="onPlayerWaiting($event)"
      ></video-player>
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
  watch: {
    isVideo() {
      if (!this.isVideo) {
        this.player.isAudio_ = true;
        this.playerOptions.poster = require("@/assets/2.gif");
      }
    }
  },
  methods: {
    onPlayerWaiting() {
      // this.playerOptions.poster = require("@/assets/loading.png");
    }
  }
};
</script>
<style lang="stylus" scoped>
@media screen and (max-height: 600px)
  #videoContainer
    height 270px
    width 480px
@media screen and (max-height: 750px) and (min-height: 600px)
  #videoContainer
    height 405px
    width 720px
@media screen and (min-height: 750px)
  #videoContainer
    height 540px
    width 960px
</style>
