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
      <div ref="audioCover" id="audioCover">
        <!-- <canvas :width="cWidth" :height="cHeight" id="canvas"></canvas> -->
        <!-- <AudioVisualization :player="$refs.videoPlayer" /> -->
      </div>
    </div>
  </div>
</template>
<script>
import videojs from "video.js";
import video_zhCN from "video.js/dist/lang/zh-CN.json";
videojs.addLanguage("zh-CN", video_zhCN);
import { ControlBtn } from "./../plugins/videojs";
import AudioVisualization from "./AudioVisualization";
export default {
  name: "Player",
  components: {
    AudioVisualization
  },
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
  data() {
    return {
      audioContext: null,
      audioInput: null,
      canvasCtx: null,
      cHeight: 0,
      cWidth: 0,
      player: null
    };
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.playerOptions, () => {
      this.player.controlBar.addChild(this.controlBtn);
    });
    this.$nextTick(() => {
      this.$refs.videoPlayer.addEventListener("timeupdate", e => {
        // console.log(e);
        // console.log(this.$refs.videoPlayer.currentTime);
        this.$store.commit({
          type: "getFilePlayCurrentTime",
          filePlayCurrentTime: Math.floor(this.$refs.videoPlayer.currentTime)
        });
      });
    });
    // this.resize();
    // window.onresize = () => {
    //   this.resize();
    // };
  },
  beforeDestroy() {
    window.removeEventListener("resize");
  },
  methods: {
    resize() {
      this.cHeight = this.$refs.audioCover.offsetHeight;
      this.cWidth = this.$refs.audioCover.offsetWidth;
    },
    draw() {
      if (!this.isVideo) {
        const canvas = document.getElementById("canvas");
        this.canvasCtx = canvas.getContext("2d");
        let cWidth = this.cWidth,
          cHeight = this.cHeight,
          barWidth = parseInt((1.4 * cWidth) / this.bufferLength),
          barHeight,
          x = 0;
        this.canvasCtx.clearRect(0, 0, cWidth, cHeight);
        //分析器获取音频数据“切片”
        this.analyser.getByteFrequencyData(this.dataArray);

        //把每个音频“切片”画在画布上
        for (var i = 0; i < this.bufferLength; i++) {
          barHeight = parseInt(2 * this.dataArray[i]);
          // this.canvasCtx.fillStyle = "rgb(27, 49, 114)";
          let color = `rgb(${i + 27}, ${6 * i + 49},${6 * i + 144})`;
          // console.log(color);
          this.canvasCtx.fillStyle = color;
          this.canvasCtx.fillRect(x, cHeight - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
    }
  },
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
    },
    isVideo(val) {
      if (!val) {
        this.$refs.audioCover.style.zIndex = 10;
      } else {
        this.$refs.audioCover.style.zIndex = -10;
      }
      // if (!val && !this.audioInput) {
      //   this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      //   this.audioInput = this.audioContext.createMediaElementSource(this.$refs.videoPlayer);
      //   //创建分析器
      //   this.analyser = this.audioContext.createAnalyser();
      //   //快速傅里叶变换参数
      //   this.analyser.fftSize = 128;
      //   //bufferArray长度
      //   this.bufferLength = this.analyser.frequencyBinCount;
      //   //创建bufferArray，用来装音频数据
      //   this.dataArray = new Uint8Array(this.bufferLength);
      //   this.scriptProcessor = this.audioContext.createScriptProcessor(4096);
      //   this.scriptProcessor.onaudioprocess = this.draw;
      //   this.audioInput.connect(this.analyser);
      //   this.analyser.connect(this.scriptProcessor);
      //   this.scriptProcessor.connect(this.audioContext.destination);
      //   this.audioInput.connect(this.audioContext.destination);
      //   // this.audioInput.connect(this.audioContext.destination);
      // } else {
      //   // this.canvasCtx.clearRect(0, 0, this.cWidth, this.cHeight);
      // }
      // console.log(val);
      // if (!val) {
      //   this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      //   this.audioInput = this.audioContext.createMediaElementSource(this.$refs.videoPlayer);
      //   this.audioInput.connect(this.audioContext.destination);
      // } else {
      //   this.audioInput = null;
      //   this.audioContext.close().then(res => {
      //     console.log(res);
      //   });
      //   this.audioContext = null;
      // }
    }
    // cHeight() {
    //   console.log("height change");
    // }
  }
};
</script>
<style lang="stylus" scoped>
#videoContainer
  position relative
#audioCover
  position absolute
  top 0
  left 0
  z-index -10
  background-size cover
  background-repeat no-repeat
  background-image url('../assets/2.gif')
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
