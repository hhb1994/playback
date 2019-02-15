<template>
  <div>
    <!-- <input v-model="value" type="range" step="1" min="1" max="1000"> -->
    <el-slider v-model="value" :max="max" :show-tooltip="false" :disabled="disabled"></el-slider>
  </div>
</template>
<script>
import debounce from "lodash/debounce";
export default {
  name: "TimeTralvel",
  data() {
    return {
      value: 0,
      max: 8640,
      disabled: false
    };
  },
  computed: {
    currentTime() {
      let year = this.$moment().format("YYYY");
      let month = this.$moment().format("MM");
      let day = this.$moment().format("DD");
      let currentTime =
        Date.parse(this.$moment().format("YYYY-MM-DD")) + this.value * 10000;
      let hour =
        new Date(currentTime).getUTCHours() < 10
          ? "0" + new Date(currentTime).getUTCHours()
          : new Date(currentTime).getUTCHours();
      let minute =
        new Date(currentTime).getUTCMinutes() < 10
          ? "0" + new Date(currentTime).getUTCMinutes()
          : new Date(currentTime).getUTCMinutes();
      let second =
        new Date(currentTime).getUTCSeconds() < 10
          ? "0" + new Date(currentTime).getUTCSeconds()
          : new Date(currentTime).getUTCSeconds();
      let timestamp = year + month + day + hour + minute + second;
      return timestamp;
    }
  },
  methods: {
    formatDate(val) {
      return val;
    },
    timeTralvel() {
      this.$axios
        .get(
          `http://10.20.50.127:8080/zbsy/GetM3U8?timestamp=${
            this.currentTime
          }&program=hnws`
        )
        .then(response => {
          this.disabled = false;
          this.$store.commit({
            type: "changeStream",
            streamSrc: response.data.data.uri,
            streamType: "application/x-mpegURL"
          });
          this.$store.commit({
            type: "changeLoadingState",
            isLoading: false
          });
        })
        .catch(error => console.log(error));
    },
    change: debounce(function() {
      this.disabled = true;
      this.$store.commit({
        type: "changeLoadingState",
        isLoading: true
      });
      this.timeTralvel();
    }, 1000)
  },
  watch: {
    currentTime() {
      this.change();
    }
  }
};
</script>
<style lang="stylus" scoped>
input
  width 800px
</style>
