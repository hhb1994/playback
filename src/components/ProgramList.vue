<template>
  <div id="programlist">
    <ul>
      <li
        v-for="(item,index) in programList"
        :key="index"
        @click="playFile(item.resourceUrl)"
      >{{item.name}}</li>
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
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].date = this.currentDate;
                response.data.data[
                  i
                ].resourceUrl = `http://10.20.50.124/${shortName}/${year}/${month}/${day}/${
                  response.data.data[i].name
                }.mp4`;
              }
            } else {
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].resourceUrl = `http://${
                  response.data.data[i].resourceUrl
                }`;
              }
            }
            this.programList = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    playFile(url) {
      this.$store.commit({
        type: "changeStream",
        streamSrc: url,
        streamType: "video/mp4"
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
