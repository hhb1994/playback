<template>
  <div id="programlist">
    <ul>
      <li
        v-for="(item,index) in programList"
        :key="index"
        @click="playFile(item)"
      >{{item.startTime}}{{item.name}}</li>
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
      currentDate: this.$moment().format("YYYY-MM-DD")
    };
  },
  computed: {
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
          `http://10.20.15.165:8080/jtjk/programs/${channelCode}/${Date}`

          //   { headers: { Authorization: token } }
        )
        .then(response => {
          if (response.data.code != 200) {
            alert("获取频道信息失败");
          } else {
            if (response.data.data[0].channelCode >= 12) {
              let year = Date.split("-")[0];
              let month = Date.split("-")[1];
              let day = Date.split("-")[2];
              let type = this.isVideo ? "mp4" : "mp3";
              for (let i = 0; i < response.data.data.length; i++) {
                let j = i < 10 ? 0 + i : i;
                response.data.data[i].date = this.currentDate;
                response.data.data[
                  i
                ].resourceUrl = `http://10.20.50.124/${shortName}/${year}/${month}/${day}/${
                  response.data.data[i].name
                }-${j}0000.${type}`;
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
    playFile(item) {
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
  color white
  height 499px
  overflow-y auto
  width 210px
  border-bottom 1px solid black
  border-right 1px solid black
</style>
