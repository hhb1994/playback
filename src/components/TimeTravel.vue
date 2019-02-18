<template>
  <div id="timetravel">
    <div>
      <span>{{currentChannel.channelName}}(拖动下方进度条来实现当天任意时间段时移)</span>
      <el-button @click="hideTimeTravel()" round><i class="el-icon-arrow-left"></i>返回直播</el-button>
    </div>
    <el-slider v-model="value" :max="max" :show-tooltip="false" :disabled="disabled"></el-slider>
    <div id="scale">
      <div v-for="(item ,index) in scale" :key="index">{{item}}</div>
    </div>
  </div>
</template>
<script>
import debounce from "lodash/debounce";
export default {
  name: "TimeTralvel",
  data() {
    return {
      value: 0,
      valueLimit:
        (Date.parse(new Date()) -
          Date.parse(this.$moment().format("YYYY-MM-DD"))) /
        10000,
      max: 8640,
      disabled: false,
      year: this.$moment().format("YYYY"),
      month: this.$moment().format("MM"),
      day: this.$moment().format("DD"),
      scale: [
        "00:00:00",
        "03:00:00",
        "06:00:00",
        "09:00:00",
        "12:00:00",
        "15:00:00",
        "18:00:00",
        "21:00:00",
        "24:00:00"
      ]
    };
  },
  computed: {
    currentTime() {
      let currentTime =
        Date.parse(this.$moment().format("YYYY-MM-DD")) + this.value * 10000;
      let hour = this.addZero(new Date(currentTime).getUTCHours());
      let minute = this.addZero(new Date(currentTime).getUTCMinutes());
      let second = this.addZero(new Date(currentTime).getUTCSeconds());
      let timestamp =
        this.year + this.month + this.day + hour + minute + second;
      return timestamp;
    },
    currentChannel: {
      get: function() {
        return this.$store.state.currentChannel;
      }
    },
    channelIndex: {
      get: function() {
        return this.$store.state.channelIndex;
      }
    }
  },
  methods: {
    addZero(val) {
      return val < 10 ? "0" + val : val;
    },
    hideTimeTravel() {
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: false
      });
      this.$store.commit({
        type: "changeStream",
        streamSrc: this.$store.state.videoStream[this.channelIndex]
      });
      this.$axios
        .get(
          `http://10.20.50.127:8080/zbsy/CloseThread?m3u8Name=${
            this.currentTime
          }&program=${this.currentChannel.channelShortName}`,
          { timeout: 20000 }
        )
        .then(response => console.log(response.data))
        .catch(error => console.log(error));
    },
    beginTimeTravel: debounce(function() {
      this.disabled = true;
      this.$store.commit({
        type: "changeLoadingState",
        isLoading: true
      });
      this.timeTralvel();
    }, 1000),
    timeTralvel() {
      this.$store.commit({
        type: "getStreamToDestory",
        uri: this.currentTime,
        shortName: this.currentChannel.channelShortName
      });
      this.$axios
        .get(
          `http://10.20.50.127:8080/zbsy/GetM3U8?timestamp=${
            this.currentTime
          }&program=${this.currentChannel.channelShortName}`,
          { timeout: 20000 }
        )
        .then(response => {
          this.actionSuccess("请求时移成功!");
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
        .catch(error => {
          console.log(error);
          this.actionFailed("请求直播时移错误!");
          this.disabled = false;
          this.$store.commit({
            type: "changeLoadingState",
            isLoading: false
          });
        });
    },
    actionSuccess(success) {
      this.$notify({
        title: "SUCCESS",
        message: success,
        type: "success",
        position: "top-left"
      });
    },
    actionFailed(fail) {
      this.$notify.error({
        title: "FAILED",
        message: fail,
        position: "top-left"
      });
    }
  },
  watch: {
    currentTime() {
      this.beginTimeTravel();
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-slider
  width 960px
.el-button
  margin-left 20px
#timetravel
  margin-top 20px
  color white
#scale
  display flex
  justify-content space-between
  width 960px
</style>
