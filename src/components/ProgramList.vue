<template>
  <div id="programlist">
    <ul>
      <li
        v-for="(item,index) in programList"
        :key="index"
        @click="playFile(item,index),bindClass(index)"
        :class="[{'programActive':programIndex == index},programClass(index)]"
      >{{item.startTime}} {{item.name}}</li>
    </ul>
  </div>
</template>
<script>
import { fileSetIp } from "./../config/config";
export default {
  name: "ProgramList",
  data() {
    return {
      programList: [],
      currentDate: this.$moment().format("YYYY-MM-DD"),
      currentTime: this.$moment().format("YYYY-MM-DDHH:mm:ss"),
      newestProgram: null,
      programNumber: null,
      timeId: null
    };
  },
  computed: {
    token: function() {
      return sessionStorage.getItem("token");
    },
    isLoginIn: function() {
      return this.$store.state.isLoginIn;
    },
    programIndex: {
      get: function() {
        return this.$store.state.programIndex;
      }
    },
    currentChannel() {
      return this.$store.state.currentChannel;
    },
    currentProgram: {
      get: function() {
        return this.$store.state.currentProgram;
      }
    },
    date: {
      get: function() {
        return this.$store.state.date;
      }
    },
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
      }
    },
    channelIndex() {
      return this.$store.state.channelIndex;
    },
    videoStream() {
      return this.$store.state.videoStream;
    },
    audioStream: {
      get: function() {
        return this.$store.state.audioStream;
      }
    },
    programClass() {
      return function(index) {
        return index > this.programNumber - 1 && (this.date == this.currentDate || this.date == null)
          ? "programListNotActive"
          : "programListActive";
      };
    }
  },
  methods: {
    getPrograms(channelCode, shortName, Date) {
      this.$req
        .getProgram(`${channelCode}/${Date}`)
        .then(response => {
          if (response.code != 200) {
            this.$actionFailed("找不到当前频道的节目单");
            this.programList = [];
          } else {
            let programList = response.data;
            let channelId = this.currentChannel.stream[0].channelId;
            if (channelId >= 22) {
              let year = Date.split("-")[0];
              let month = Date.split("-")[1];
              let day = Date.split("-")[2];
              let type = this.isVideo ? "mp4" : "mp3";
              for (let i = 0; i < programList.length; i++) {
                let hours = programList[i].startTime.split(":")[0];
                let minutes = programList[i].startTime.split(":")[1];
                programList[i].date = this.date;
                programList[
                  i
                ].resourceUrl = `${fileSetIp}${shortName}/${year}/${month}/${day}/${programList[i].name}-${hours}${minutes}00.${type}`;
              }
            } else if (channelId < 22 && channelId > 11) {
              for (let i = 0; i < programList.length; i++) {
                let url = programList[i].resourceUrl.replace(/sd[/]/, "/");
                programList[i].resourceUrl = `http://${url}`;
              }
            } else {
              for (let i = 0; i < programList.length; i++) {
                programList[i].resourceUrl = `http://${programList[i].resourceUrl}`;
              }
            }
            this.programList = programList;
            //获取当前频道/滚动
            this.$nextTick(() => {
              this.scrollList();
              this.scrollListInTime();
            });
          }
        })
        .catch(err => {
          this.$actionFailed(err);
        });
    },
    scrollList() {
      this.programNumber = null;
      for (let i = 0; i < this.programList.length; i++) {
        if (this.programList[i].startTime > this.$moment().format("HH:mm:ss")) {
          this.programNumber = i;
          // 滚动
          document.getElementById("programlist").scrollTo({
            behavior: "smooth",
            top: 40 * (this.programNumber - 3)
          });
          break;
        }
      }
      if (this.programNumber == null) {
        this.programNumber = this.programList.length; // 滚动
        document.getElementById("programlist").scrollTo({
          behavior: "smooth",
          top: 40 * (this.programNumber - 3)
        });
        document.getElementById("programlist").scrollTo({
          behavior: "smooth",
          top: document.getElementById("programlist").scrollHeight
        });
      }
      this.newestProgram = this.programList[this.programNumber - 1].id;
      this.$store.commit({
        type: "getCurrentProgram",
        currentProgram: this.programList[this.programNumber - 1]
      });
      this.$store.commit({
        type: "getTimeTravelProgram",
        timeTravelProgram: this.programList[this.programNumber - 1]
      });
      this.$store.commit({
        type: "changeProgramIndex",
        programIndex: this.programNumber - 1
      });
    },
    scrollListInTime() {
      clearTimeout(this.timeId);
      this.timeId = setInterval(() => this.scrollList2(), 10000);
    },
    scrollList2() {
      if (this.programList[this.programNumber - 1]) {
        if (this.programList[this.programNumber - 1].endTime < this.$moment().format("HH:mm:ss")) {
          if (this.programNumber < this.programList.length) {
            this.programNumber++;
          }
          this.newestProgram = this.programList[this.programNumber - 1].id;
          this.$store.commit({
            type: "getCurrentProgram",
            currentProgram: this.programList[this.programNumber - 1]
          });
          this.$store.commit({
            type: "getTimeTravelProgram",
            timeTravelProgram: this.programList[this.programNumber - 1]
          });
        }
      }
    },
    calClick(program) {
      if (this.isLoginIn) {
        this.$req.click({ channelCode: this.currentChannel.stream[0].channelId, program: program, type: "replay" });
      }
    },
    changeTimeTravelState() {
      this.$store.commit({
        type: "changeTimeTravelState",
        isTimeTravel: false
      });
    },
    submitCurrentProgram(item) {
      this.$store.commit({
        type: "getCurrentProgram",
        currentProgram: item
      });
    },
    playFile(item, index) {
      if (index > this.programNumber - 1 && this.currentDate == item.date) {
        this.$actionFailed("此节目还没有收录");
      } else {
        //提交当前节目
        this.submitCurrentProgram(item);
        if (item.id == this.newestProgram && this.currentDate == item.date) {
          //点击当前节目回到直播
          if (this.isVideo) {
            this.$store.commit({
              type: "getCurrentChannel",
              currentChannel: this.videoStream[this.channelIndex]
            });
          } else {
            this.$store.commit({
              type: "getCurrentChannel",
              currentChannel: this.audioStream[this.channelIndex]
            });
          }
        } else {
          //统计点击量
          this.calClick(item.name);
          // 修改时移状态
          this.changeTimeTravelState();
          //拼接文件地址 fuck

          //提交文件更改
          let streamType = this.isVideo ? "video/mp4" : "audio/mp3";
          let channelId = this.currentChannel.stream[0].channelId;
          let channelShortName = this.currentChannel.stream[0].channelShortName;
          let currentChannel = { ...this.currentChannel };
          currentChannel.stream = [
            {
              channelId: channelId,
              channelShortName: channelShortName,
              streamType: streamType,
              streamSrc: item.resourceUrl
            }
          ];
          this.$store.commit({
            type: "getCurrentChannel",
            currentChannel: currentChannel
          });
        }
      }
    },
    bindClass(index) {
      // if (index <= this.programNumber - 1 && this.currentDate == item.date) {
      this.$store.commit({
        type: "changeProgramIndex",
        programIndex: index
      });
      // }
    }
  },
  watch: {
    currentChannel(channel) {
      if (channel.stream[0].streamType == "application/x-mpegURL") {
        let programDate = this.date == null ? this.currentDate : this.date;
        this.getPrograms(channel.stream[0].channelId, channel.stream[0].channelShortName, programDate);
      }
    },
    date(changedDate) {
      let programDate = changedDate == null ? this.currentDate : changedDate;
      this.getPrograms(this.currentChannel.stream[0].channelId, this.currentChannel.stream[0].channelShortName, programDate);
    }
  }
};
</script>
<style lang="stylus" scoped>
@media screen and (max-height: 600px)
  #programlist
    height 215px
@media screen and (max-height: 750px) and (min-height: 600px)
  #programlist
    height 350px
@media screen and (min-height: 750px)
  #programlist
    height 485px
#programlist
  cursor pointer
  color white
  overflow-y auto
  width 200px
  border-bottom 1px solid black
  border-right 1px solid black
  ul li
    font-size 11px
    height 30px
    border-bottom 1px solid black
    padding-top 10px
    padding-left 10px
    transition 300ms
    &:hover
      height 35px
      white-space normal
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
.programListNotActive
  color gray
  cursor not-allowed
.programListActive
  color white
  cursor pointer
.programActive
  background-color rgb(31, 31, 31)
  border-left 3px solid #008eff
  transition 300ms
.programListInRecord
  display none
#programlist::-webkit-scrollbar
  width 2px
#programlist::-webkit-scrollbar-track
  border-radius 1px
  background-color darkgray
#programlist::-webkit-scrollbar-thumb
  border-radius 1px
  background white
</style>
