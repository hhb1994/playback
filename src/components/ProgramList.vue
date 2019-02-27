<template>
  <div id="programlist">
    <ul>
      <li
        v-for="(item,index) in programList"
        :key="index"
        @click="playFile(item,$event),bindClass(index)"
        :class="{'programActive':programIndex === index}"
      >
        <div
          :class="(((item.date+item.startTime) >= currentTime))?'programListNotActive':'programListActive'"
        >{{item.startTime}} {{item.name}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "ProgramList",
  data() {
    return {
      token: document.cookie.split(";")[0].split("=")[1],
      programList: [],
      currentDate: this.$moment().format("YYYY-MM-DD"),
      currentTime: this.$moment().format("YYYY-MM-DDHH:mm:ss")
    };
  },
  computed: {
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
    date: {
      get: function() {
        return this.$store.state.date;
      }
    },
    isVideo: {
      get: function() {
        return this.$store.state.isVideo;
      }
    }
  },
  methods: {
    getPrograms(channelCode, shortName, Date) {
      this.$axios
        .get(
          `http://10.20.15.165:8080/jtjk/programs/${channelCode}/${Date}`,

          { headers: { Authorization: this.token } }
        )
        .then(response => {
          if (response.data.code != 200) {
            this.actionFailed("找不到当前频道的节目单");
            this.programList = [];
          } else {
            if (response.data.data[0].channelCode >= 12) {
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
            } else {
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].resourceUrl = `http://${
                  response.data.data[i].resourceUrl
                }`;
              }
            }
            this.programList = response.data.data;

            //获取当前频道/滚动
            for (let i = 0; i < response.data.data.length; i++) {
              if (
                response.data.data[i].startTime >
                this.$moment().format("HH:mm:ss")
              ) {
                this.$store.commit({
                  type: "getCurrentProgram",
                  currentProgram: response.data.data[i - 1]
                });
                this.$store.commit({
                  type: "changeProgramIndex",
                  programIndex: i - 1
                });

                document.getElementById("programlist").scrollTo({
                  behavior: "smooth",
                  top: 40 * (i - 3)
                });
                break;
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    playFile(item, event) {
      if (event.target.className.split(" ")[0] == "programListNotActive") {
        this.actionFailed("此节目还没有收录");
      } else {
        this.$store.commit({
          type: "changeTimeTravelState",
          isTimeTravel: false
        });
        this.actionSuccess(`开始播放文件: ${item.name}`);
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
  mounted() {
    this.getPrograms(1, "zjws", this.currentDate);
  },
  watch: {
    currentChannel(data) {
      this.getPrograms(data.channelId, data.channelShortName, this.currentDate);
    },
    date(data) {
      this.getPrograms(
        this.$store.state.currentChannel.channelId,
        this.$store.state.currentChannel.channelShortName,
        data
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
#programlist
  margin-left 5px
  cursor pointer
  color white
  height 490px
  overflow-y auto
  width 210px
  border-bottom 1px solid black
  border-right 1px solid black
  ul li
    font-size 10px
    height 30px
    border-bottom 1px solid black
    padding-top 10px
    padding-left 10px
    transition 300ms
    &:hover
      height 35px
      div
        white-space normal
    div
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
#programlist::-webkit-scrollbar
  width 2px
#programlist::-webkit-scrollbar-track
  border-radius 1px
  background-color darkgray
#programlist::-webkit-scrollbar-thumb
  border-radius 1px
  background white
</style>
