<template>
  <div id="info">
    <span>{{currentChannel}} </span>
    <span>{{currentProgram.date}} </span>
    <span>{{currentProgram.startTime}} </span>
    <span>{{currentProgram.name}}</span>
  </div>
</template>
<script>
export default {
  name: "Info",
  computed: {
    currentChannel: {
      get: function() {
        return this.$store.state.currentChannel.channelName;
      }
    },
    currentProgram: {
      get: function() {
        return this.$store.state.currentProgram;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
#info
  color white
</style>
