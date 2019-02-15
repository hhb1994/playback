<template>
  <div>
    <!-- <input v-model="value" type="range" step="1" min="1" max="1000"> -->
    <el-slider v-model="value" :format-tooltip="formatDate"></el-slider>
  </div>
</template>
<script>
export default {
  name: "TimeTralvel",
  data() {
    return {
      value: 0
    };
  },
  methods: {
    formatDate(val) {
      return val / 100;
    }
  },
  mounted() {}
  //   watch: {
  //     value: function(val) {
  //       console.log(val);
  //     }
  //   }
};
</script>
<style lang="stylus" scoped>
input
  width 800px
</style>
