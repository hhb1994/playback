<template>
  <div id="channelList">
    <div v-if="isVideo">
      <ul>
        <li
          v-for="(item,index) in videoChannelList"
          :key="index"
          @click="changeStream(index),getCurrentChannel(item),bindClass(index),backToLive()"
          :class="{'channelActive':channelIndex === index}"
        >
          <img :src="item.videoImgSrc">
          <span>{{item.channelName}}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      <ul>
        <li
          v-for="(item,index) in audioChannelList"
          :key="index"
          @click="changeStream(index),getCurrentChannel(item),bindClass(index)"
          :class="{'channelActive':channelIndex === index}"
        >
          <img :src="item.audioImgSrc">
          <span>{{item.channelName}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChannelList",
  data() {
    return {
      videoChannelList: [],
      videoStream: [],
      audioChannelList: [],
      audioStream: []
    };
  },
  computed: {
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
      }
    },
    channelIndex: {
      get: function() {
        return this.$store.state.channelIndex;
      }
    },
    isLoginIn: {
      get: function() {
        return this.$store.state.isLoginIn;
      }
    }
  },
  methods: {
    // 获取直播频道列表,并根据广播/电视分类
    getChannelList() {
      this.$axios
        .get("http://10.20.15.165:8080/jtjk/channels", { timeout: 5000 })
        .then(response => {
          if (response.data.code != 200) {
            this.actionFailed("无法获取频道信息!");
          } else {
            response.data.data.reverse();
            for (let i = 0; i < response.data.data.length; i++) {
              if (response.data.data[i].group.name == "arcvideo") {
                let videoChannelName = response.data.data[i].name.split("-")[0];
                let videoChannelShortName = response.data.data[i].name.split(
                  "-"
                )[1];
                this.videoChannelList.push({
                  channelName: videoChannelName,
                  channelId: response.data.data[i].id,
                  channelShortName: videoChannelShortName,
                  videoImgSrc: require(`@/assets/icons/${
                    response.data.data[i].id
                  }.png`)
                });
                this.videoStream.push(
                  "http://10.20.50.127:8081/" +
                    videoChannelShortName +
                    "/index.m3u8"
                );
              } else {
                let audioChannelName = response.data.data[i].name.split("-")[0];
                let audioChannelShortName = response.data.data[i].name.split(
                  "-"
                )[1];
                this.audioChannelList.push({
                  channelName: audioChannelName,
                  channelId: response.data.data[i].id,
                  channelShortName: audioChannelShortName,
                  audioImgSrc: require(`@/assets/icons/${
                    response.data.data[i].id
                  }.png`)
                });
                this.audioStream.push(
                  "http://10.20.50.127:8081/" +
                    audioChannelShortName +
                    "/index.m3u8"
                );
              }
            }
          }
        })
        .catch(error => {
          this.actionFailed("获取频道信息出错!");
          console.log(error);
        });
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: {
          channelName: "浙江卫视高清",
          channelId: 1,
          channelShortName: "zjws"
        }
      });
      this.$store.commit({
        type: "getAllVideoStream",
        videoStream: this.videoStream
      });
    },
    // 切换直播源
    changeStream(index) {
      if (this.isVideo) {
        this.$store.commit({
          type: "changeStream",
          streamSrc: this.videoStream[index],
          streamType: "application/x-mpegURL"
        });
      } else {
        this.$store.commit({
          type: "changeStream",
          streamSrc: this.audioStream[index],
          streamType: "application/x-mpegURL"
        });
      }
    },
    bindClass(index) {
      this.$store.commit({
        type: "changeChannelIndex",
        channelIndex: index
      });
    },
    // 提交当前正在播放的频道信息
    getCurrentChannel(currentChannel) {
      if (this.isLoginIn) {
        this.$store.commit({
          type: "getCurrentChannel",
          currentChannel: currentChannel
        });
      }
    },
    backToLive() {
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: false
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
  mounted() {
    this.getChannelList();
  }
};
</script>
<style lang="stylus" scoped>
@media screen and (max-height: 600px)
  #channelList
    height 218px
@media screen and (max-height: 750px) and (min-height: 600px)
  #channelList
    height 353px
@media screen and (min-height: 750px)
  #channelList
    height 488px
#channelList
  width 164px
  color white
  margin-left 10px
  overflow-y auto
  background-color black
  cursor pointer
  border-right 1px solid rgb(31, 31, 31)
  li
    font-size 14px
    font-weight 500
    height 35px
    color white
    margin-top 0.1rem
    vertical-align middle
    &:hover
      background-color rgb(31, 31, 31)
      transition 300ms
  img
    max-height 100%
    width 40px
    padding-left 0.3rem
    padding-right 0.5rem
    vertical-align middle
    min-height 20px
.channelActive
  background-color rgb(31, 31, 31)
  border-left 3px solid #409EFF
  transition 300ms
#channelList::-webkit-scrollbar
  width 2px
#channelList::-webkit-scrollbar-track
  border-radius 1px
  background-color darkgrey
#channelList::-webkit-scrollbar-thumb
  border-radius 1px
  background white
</style>
