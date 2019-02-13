<template>
  <div id="channelList">
    <div v-if="isVideo">
      <ul>
        <li
          v-for="(item,index) in videoChannelList"
          :key="index"
          @click="changeStream(index),getCurrentChannel(item)"
        >{{item.channelName}}</li>
      </ul>
    </div>
    <div v-else>
      <ul>
        <li
          v-for="(item,index) in audioChannelList"
          :key="index"
          @click="changeStream(index),getCurrentChannel(item)"
        >{{item.channelName}}</li>
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
                  channelShortName: videoChannelShortName
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
                  channelShortName: audioChannelShortName
                });
                this.audioStream.push(
                  "http://10.20.50.127/" +
                    response.data.data[i].uri.substring(18) +
                    ".m3u8"
                );
              }
            }
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
  width 174px
  cursor pointer
  border-right 1px solid rgb(31, 31, 31)
  &::-webkit-scrollbar
    width 1px
  &::-webkit-scrollbar-track
    border-radius 1px
    background-color darkgray
  &::-webkit-scrollbar-thumb
    border-radius 1px
    background white
</style>
