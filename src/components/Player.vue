<template>
  <div>
    <div id="videoContainer">
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
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
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: true,
        loop: false,
        preload: "auto",
        language: "zh-CN",
        aspectRatio: "16:9",
        fluid: true,
        sources: [
          {
            type: this.$store.state.initType,
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
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  mounted() {
    this.$store.commit({
      type: "getPlayer",
      player: this.player.options_.sources[0]
    });
  }
};
</script>
<style lang="stylus" scoped>
#videoContainer
  height 540px
  width 960px
</style>
