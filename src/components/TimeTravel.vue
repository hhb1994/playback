<template>
  <div id="timetravel">
    <div>
      <span>{{currentChannel.channelName}}(拖动下方进度条来时移当前正在播放的节目)</span>
      <el-button id="back" @click="hideTimeTravel()" type="text">
        <i class="el-icon-arrow-left"></i>返回直播
      </el-button>
    </div>
    <el-slider v-model="value" :max="max" :show-tooltip="false" :disabled="disabled"></el-slider>
    <div id="scale">
      <div>{{timeTravelProgram.startTime}}</div>
      <div>{{timeTravelProgram.endTime}}</div>
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
      disabled: false,
      year: this.$moment().format("YYYY"),
      month: this.$moment().format("MM"),
      day: this.$moment().format("DD"),
      currentDateTime: Date.parse(new Date())
    };
  },
  computed: {
    valueLimit: function() {
      return ~~((this.currentDateTime - Date.parse(this.$moment().format("YYYY/MM/DD") + " " + this.timeTravelProgram.startTime)) / 10000);
    },
    max: function() {
      return ~~(
        (Date.parse(this.$moment().format("YYYY/MM/DD") + " " + this.timeTravelProgram.endTime) -
          Date.parse(this.$moment().format("YYYY/MM/DD") + " " + this.timeTravelProgram.startTime)) /
        10000
      );
    },
    currentTime() {
      let currentTime = Date.parse(this.$moment().format("YYYY/MM/DD") + " " + this.timeTravelProgram.startTime) + this.value * 10000;
      let hour = this.addZero(new Date(currentTime).getHours());
      let minute = this.addZero(new Date(currentTime).getMinutes());
      let second = this.addZero(new Date(currentTime).getSeconds());
      let timestamp = this.year + this.month + this.day + hour + minute + second;
      return timestamp;
    },
    currentChannel: {
      get: function() {
        return this.$store.state.currentChannel;
      }
    },
    timeTravelProgram: {
      get: function() {
        return this.$store.state.timeTravelProgram;
      }
    },
    channelIndex() {
      return this.$store.state.channelIndex;
    },
    streamToDestory: {
      get: function() {
        return this.$store.state.streamToDestory;
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
      // console.log(this.$store.state.videoStream[this.channelIndex]);
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: this.$store.state.videoStream[this.channelIndex]
      });
      this.destoryStream();
    },
    beginTimeTravel: debounce(function() {
      this.destoryStream();
      if (this.value < this.valueLimit) {
        this.disabled = true;
        this.$store.commit({
          type: "changeLoadingState",
          isLoading: true
        });
        this.timeTralvel();
      } else if (this.value > this.valueLimit) {
        this.$actionFailed("直播时移不能超过当前时间!");
        this.value = this.valueLimit;
      } else {
        return;
      }
    }, 780),
    destoryStream() {
      if (this.streamToDestory.streamUri && this.streamToDestory.shortName) {
        this.$req.destoryStream({
          m3u8Name: this.streamToDestory.streamUri,
          program: this.streamToDestory.shortName
        });
      }
    },
    timeTralvel() {
      this.$store.commit({
        type: "getStreamToDestory",
        uri: this.currentTime,
        shortName: this.currentChannel.channelShortName
      });
      this.$req
        .getStream({
          timestamp: this.currentTime,
          program: this.currentChannel.stream[0].channelShortName
        })
        .then(response => {
          this.disabled = false;
          let channelId = this.currentChannel.stream[0].channelId;
          let channelShortName = this.currentChannel.stream[0].channelShortName;
          let streamType = this.currentChannel.stream[0].streamType;
          let currentChannel = { ...this.currentChannel };
          // currentChannel.stream = response.data.uri;
          currentChannel.stream = [
            {
              channelId: channelId,
              channelShortName: channelShortName,
              streamType: streamType,
              streamSrc: response.data.uri
            }
          ];
          // console.log(currentChannel);
          this.$store.commit({
            type: "getCurrentChannel",
            currentChannel: currentChannel
          });
          this.$store.commit({
            type: "changeLoadingState",
            isLoading: false
          });
        })
        .catch(() => {
          this.$actionFailed("请求直播时移错误!");
          this.disabled = false;
          this.$store.commit({
            type: "changeLoadingState",
            isLoading: false
          });
        });
    }
  },
  watch: {
    currentTime() {
      if (this.value != this.valueLimit && this.value != 0) {
        this.beginTimeTravel();
      }
    },
    timeTravelProgram(newVal, oldVal) {
      if (newVal.startTime != oldVal.startTime) {
        this.value = 0;
      }
    }
  },
  mounted() {
    this.value = this.valueLimit;
    this.timer = setInterval(() => {
      this.currentDateTime = Date.parse(new Date());
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
#back
  font-size 20px
</style>
