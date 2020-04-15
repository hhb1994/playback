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
            @click="getCurrentChannel(item),bindClass(index),backToLive(),registerChannel(item)"
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
            @click="getCurrentChannel(item),bindClass(index),registerChannel(item)"
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
      audioChannelList: []
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
        .then(res => {
          if (res.code != 200) {
            this.$actionFailed("获取频道列表失败");
          } else {
            let channelList = res.data;
            channelList.reverse();
            channelList
              .filter(item => item.group.name == "audio")
              .forEach(item => {
                let audioChannelName = item.name.split("-")[0];
                let audioChannelShortName = item.name.split("-")[1];
                this.audioChannelList.push({
                  channelName: audioChannelName,
                  audioImgSrc: require(`@/assets/icons/${item.id}.png`),
                  stream: [
                    {
                      streamSrc: `http://10.20.50.127:8081/${audioChannelShortName}/index.m3u8`,
                      streamType: "application/x-mpegURL",
                      channelId: item.id,
                      channelShortName: audioChannelShortName
                    }
                  ]
                });
              });
            channelList
              .filter(item => item.group.name == "arcvideo")
              .forEach(item => {
                let listIndex = this.videoChannelList.findIndex(item2 => item2.channelName == item.name.substring(0, 4));
                if (listIndex == -1) {
                  this.videoChannelList.push({
                    channelName: item.name.substring(0, 4),
                    videoImgSrc: require(`@/assets/icons/${item.id}.png`),
                    stream: [
                      {
                        channelId: item.id,
                        streamType: "application/x-mpegURL",
                        channelShortName: item.name.split("-")[1],
                        streamSrc: `http://10.20.50.127:8081/${item.name.split("-")[1]}/index.m3u8`
                      }
                    ]
                  });
                } else {
                  this.videoChannelList[listIndex].stream.push({
                    channelId: item.id,
                    streamType: "application/x-mpegURL",
                    channelShortName: item.name.split("-")[1],
                    streamSrc: `http://10.20.50.127:8081/${item.name.split("-")[1]}/index.m3u8`
                  });
                  this.videoChannelList[listIndex].stream.reverse();
                }
              });
            this.$store.commit({
              type: "getCurrentChannel",
              currentChannel: this.videoChannelList[0]
            });
            this.$store.commit({
              type: "getAllVideoStream",
              videoStream: this.videoChannelList
            });
            this.$store.commit({
              type: "getAllAudioStream",
              audioStream: this.audioChannelList
            });
          }
        })
        .catch(err => {
          this.$actionFailed(err);
        });
    },

    bindClass(index) {
      this.$store.commit({
        type: "changeChannelIndex",
        channelIndex: index
      });
    },
    // 提交当前正在播放的频道信息和直播流
    getCurrentChannel(currentChannel) {
      // console.log(currentChannel);
      
      this.$store.commit({
        type: "getCurrentChannel",
        currentChannel: currentChannel
      });
    },
    //统计频道点击信息
    registerChannel(item) {
      if (this.isLoginIn) {
        this.$req.click({ channelCode: item.stream[0].channelId,type:"live" });
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
  width 134px
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
