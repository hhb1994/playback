<template>
  <div id="channelList">
    <div v-if="isVideo">
      <ul>
        <li
          v-for="(item,index) in videoChannelList"
          :key="index"
          @click="changeStream(index),getCurrentChannel(item),bindClass(index)"
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
          @click="changeStream(index),getCurrentChannel(item)"
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
            this.actionSuccess("获取频道信息成功!");
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
                  "http://10.20.50.127/jtjk/" +
                    response.data.data[i].uri.substring(24) +
                    ".m3u8"
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
                  "http://10.20.50.127/" +
                    response.data.data[i].uri.substring(18) +
                    ".m3u8"
                );
              }
            }
            // for (let i = 0; i < this.videoChannelList.length; i++) {
            //   this.videoChannelList.push({
            //     videoImgSrc: `/static/images/${i}.png`
            //   });
            // }
          }
        })
        .catch(error => {
          this.actionFailed("获取节目信息出错!");
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
    bindClass(index) {},
    // 获取当前正在播放的频道信息
    getCurrentChannel(currentChannel) {
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: currentChannel
      });
    },
    actionSuccess(success) {
      this.$notify({
        title: "成功",
        message: success,
        type: "success"
      });
    },
    actionFailed(fail) {
      this.$notify.error({
        title: "失败",
        message: fail
      });
    }
  },
  mounted() {
    this.getChannelList();
  }
};
</script>
<style lang="stylus" scoped>
#channelList
  color white
  margin-left 10px
  height 500px
  overflow-y auto
  background-color black
  width 194px
  cursor pointer
  border-right 1px solid rgb(31, 31, 31)
  &::-webkit-scrollbar
    width 1px
  &::-webkit-scrollbar-track
    border-radius 1px
    background-color darkgray
  &::scrollbar-thumb
    border-radius 1px
    background white
  li
    height 35px
    color white
    font-weight 600
    margin-top 0.1rem
    vertical-align middle
    &:hover
      background-color rgb(31, 31, 31)
      transition 300ms
  img
    max-height 100%
    width 40px
    padding-left 1rem
    padding-right 0.5rem
    vertical-align middle
    min-height 20px
</style>
