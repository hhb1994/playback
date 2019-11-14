<template>
  <div id="channelList">
    <transition
      :enter-active-class="enterActiveClass"
      :leave-active-class="leaveActiveClass"
      mode="out-in"
      type="animation"
    >
      <div v-if="isVideo" key="videoList">
        <ul>
          <li
            v-for="(item,index) in videoChannelList"
            :key="index"
            @click="changeStream(index),getCurrentChannel(item),bindClass(index),backToLive(),registerChannel(item)"
            :class="{'channelActive':channelIndex === index}"
          >
            <img :src="item.videoImgSrc" />
            <span>{{item.channelName}}</span>
          </li>
        </ul>
      </div>
      <div v-if="!isVideo" key="audioList">
        <ul>
          <li
            v-for="(item,index) in audioChannelList"
            :key="index"
            @click="changeStream(index),getCurrentChannel(item),bindClass(index),registerChannel(item)"
            :class="{'channelActive':channelIndex === index}"
          >
            <img :src="item.audioImgSrc" />
            <span>{{item.channelName}}</span>
          </li>
        </ul>
      </div>
    </transition>
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
    token: function() {
      return sessionStorage.getItem("token");
    },
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
    },
    enterActiveClass() {
      return this.isVideo ? "animated slideInLeft faster" : "animated slideInRight faster";
    },
    leaveActiveClass() {
      return this.isVideo ? "animated slideOutRight faster" : "animated slideOutLeft faster";
    }
  },
  methods: {
    // 获取直播频道列表,并根据广播/电视分类
    getChannelList() {
      this.$req
        .getChannel()
        .then(response => {
          if (response.code != 200) {
            console.log(response.data);
          } else {
            let streamList = response.data;
            streamList.reverse();
            for (let i = 0; i < streamList.length; i++) {
              if (streamList[i].group.name == "arcvideo") {
                let videoChannelName = streamList[i].name.split("-")[0];
                let videoChannelShortName = streamList[i].name.split("-")[1];
                this.videoChannelList.push({
                  channelName: videoChannelName,
                  channelId: streamList[i].id,
                  channelShortName: videoChannelShortName,
                  videoImgSrc: require(`@/assets/icons/${streamList[i].id}.png`)
                });
                this.videoStream.push("http://10.20.50.127:8081/" + videoChannelShortName + "/index.m3u8");
              } else {
                let audioChannelName = streamList[i].name.split("-")[0];
                let audioChannelShortName = streamList[i].name.split("-")[1];
                this.audioChannelList.push({
                  channelName: audioChannelName,
                  channelId: streamList[i].id,
                  channelShortName: audioChannelShortName,
                  audioImgSrc: require(`@/assets/icons/${streamList[i].id}.png`)
                });
                this.audioStream.push("http://10.20.50.127:8081/" + audioChannelShortName + "/index.m3u8");
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: {
          channelName: "浙江卫视标清",
          channelId: 1,
          channelShortName: "zjwssd"
        }
      });
      this.$store.commit({
        type: "getAllVideoStream",
        videoStream: this.videoStream
      });
      this.$store.commit({
        type: "getAllAudioStream",
        audioStream: this.audioStream
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
      // this.$store.commit({
      //   type: "changeDate",
      //   date: null
      // });
    },
    bindClass(index) {
      this.$store.commit({
        type: "changeChannelIndex",
        channelIndex: index
      });
    },
    // 提交当前正在播放的频道信息
    getCurrentChannel(currentChannel) {
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: currentChannel
      });
    },
    //统计频道点击信息
    registerChannel(id) {
      if (this.token) {
        this.$req.click({ channelCode: id.channelCode });
      }
    },
    backToLive() {
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: false
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
    list-style none
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
