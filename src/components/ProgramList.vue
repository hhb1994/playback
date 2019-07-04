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
      if (
        document.cookie
          .split(";")
          .findIndex(item => item.trim().substring(0, 8) == "vodToken") != -1
      ) {
        return document.cookie
          .split(";")
          [
            document.cookie
              .split(";")
              .findIndex(item => item.trim().substring(0, 8) == "vodToken")
          ].split("=")[1];
      } else {
        return undefined;
      }
    },
    programIndex: {
      get: function() {
        return this.$store.state.programIndex;
      }
    },
    currentChannel: {
      get: function() {
        return this.$store.state.currentChannel;
      }
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
    channelIndex: {
      get: function() {
        return this.$store.state.channelIndex;
      }
    },
    videoStream: {
      get: function() {
        return this.$store.state.videoStream;
      }
    },
    audioStream: {
      get: function() {
        return this.$store.state.audioStream;
      }
    },
    programClass() {
      return function(index) {
        return index > this.programNumber - 1 &&
          (this.date == this.currentDate || this.date == null)
          ? "programListNotActive"
          : "programListActive";
      };
    }
  },
  methods: {
    getPrograms(channelCode, shortName, Date) {
      this.$axios
        .get(`http://10.20.50.124:8080/jtjk/programs/${channelCode}/${Date}`)
        .then(response => {
          if (response.data.code != 200) {
            this.actionFailed("找不到当前频道的节目单");
            this.programList = [];
          } else {
            if (this.currentChannel.channelId >= 22) {
              let year = Date.split("-")[0];
              let month = Date.split("-")[1];
              let day = Date.split("-")[2];
              let type = this.isVideo ? "mp4" : "mp3";
              for (let i = 0; i < response.data.data.length; i++) {
                let hours = response.data.data[i].startTime.split(":")[0];
                let minutes = response.data.data[i].startTime.split(":")[1];
                response.data.data[i].date = this.date;
                response.data.data[
                  i
                ].resourceUrl = `http://10.20.50.124/${shortName}/${year}/${month}/${day}/${
                  response.data.data[i].name
                }-${hours}${minutes}00.${type}`;
              }
            } else if (
              this.currentChannel.channelId < 22 &&
              this.currentChannel.channelId > 11
            ) {
              for (let i = 0; i < response.data.data.length; i++) {
                let url = response.data.data[i].resourceUrl.replace(
                  /sd[/]/,
                  "/"
                );
                response.data.data[i].resourceUrl = `http://${url}`;
              }
            } else {
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].resourceUrl = `http://${
                  response.data.data[i].resourceUrl
                }`;
              }
            }
            this.programList = response.data.data;
            //获取当前频道/滚动
            this.$nextTick(() => {
              this.scrollList();
              this.scrollListInTime();
            });
          }
        })
        .catch(error => {
          console.log(error);
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
      if (
        this.programList[this.programNumber - 1].endTime <
        this.$moment().format("HH:mm:ss")
      ) {
        this.programNumber++;
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
    },

    playFile(item, index) {
      if (index > this.programNumber - 1 && this.currentDate == item.date) {
        this.actionFailed("此节目还没有收录");
      } else {
        if (item.id !== this.newestProgram) {
          //统计点击量
          if (this.token) {
            this.$axios
              .post(
                `http://10.20.50.124:8080/jtjk/click`,
                {
                  channelCode: this.currentChannel.channelId,
                  program: item.name
                },
                {
                  headers: { Authorization: this.token }
                }
              )
              .catch(err => console.log(err));
          }
          // 修改时移状态
          this.$store.commit({
            type: "changeTimeTravelState",
            isTimeTravel: false
          });
          if (this.isVideo) {
            this.$store.commit({
              type: "changeStream",
              streamSrc: item.resourceUrl,
              streamType: "video/mp4"
            });
          } else {
            this.$store.commit({
              type: "changeStream",
              streamSrc: item.resourceUrl,
              streamType: "audio/mp3"
            });
          }
          this.$store.commit({
            type: "getCurrentProgram",
            currentProgram: item
          });
        } else {
          // 点击最后一个节目返回直播
          this.$store.commit({
            type: "getCurrentProgram",
            currentProgram: this.programList[this.programNumber - 1]
          });
          if (this.isVideo) {
            this.$store.commit({
              type: "changeStream",
              streamSrc: this.videoStream[this.channelIndex],
              streamType: "application/x-mpegURL"
            });
          } else {
            this.$store.commit({
              type: "changeStream",
              streamSrc: this.audioStream[this.channelIndex],
              streamType: "application/x-mpegURL"
            });
          }
        }
      }
    },
    bindClass(index) {
      this.$store.commit({
        type: "changeProgramIndex",
        programIndex: index
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
    currentChannel(data) {
      this.date == null
        ? this.getPrograms(
            data.channelId,
            data.channelShortName,
            this.currentDate
          )
        : this.getPrograms(data.channelId, data.channelShortName, this.date);
    },
    date(data) {
      data == null
        ? this.getPrograms(
            this.$store.state.currentChannel.channelId,
            this.$store.state.currentChannel.channelShortName,
            this.currentDate
          )
        : this.getPrograms(
            this.$store.state.currentChannel.channelId,
            this.$store.state.currentChannel.channelShortName,
            data
          );
    }
  },
  beforeCreate() {}
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
  margin-left 5px
  cursor pointer
  color white
  overflow-y auto
  width 210px
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
