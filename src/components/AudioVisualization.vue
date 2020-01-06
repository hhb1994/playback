<template>
  <div>
    <p>Audio visualization</p>
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
export default {
  name: "AudioVisualization",
  props: {
    player: {
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    initAudioContext() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let audioInput = this.audioContext.createMediaElementSource(this.player);
      audioInput.connect(this.audioContext.destination);
    }
  },
  mounted() {
    this.initAudioContext();
  },
  beforeDestroy() {
    // this.audioContext.close();
    // this.audioContext = "";
  }
};
</script>