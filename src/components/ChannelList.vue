<template>
  <div id="channelList">
    <div v-if="isVideo">
      <ul>
        <li
          v-for="(item,index) in videoChannelList"
          :key="index"
          @click="changeStream(index)"
        >{{item}}</li>
      </ul>
    </div>
    <div v-else></div>
  </div>
</template>
<script>
export default {
  name: "ChannelList",
  data() {
    return {
      isVideo: this.$store.state.isVideo,
      videoChannelList: [],
      videoChannelListShort: [],
      videoStream: [],
      audioChannelList: [],
      audioChannelListShort: [],
      audioStream: []
    };
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
                this.videoChannelList.push(videoChannelName);
                this.videoChannelListShort.push(videoChannelShortName);
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
                this.audioChannelList.push(audioChannelName);
                this.audioChannelListShort.push(audioChannelShortName);
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
    },
    changeStream(index) {
      this.$store.commit({
        type: "changeStream",
        streamSrc: this.videoStream[index],
        streamType: "application/x-mpegURL"
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
