<template>
  <div>
    <el-date-picker
      v-model="date"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  name: "DatePicker",
  data() {
    return {
      date: ""
    };
  },
  watch: {
    date(data) {
      console.log(data);
      this.$store.commit({
        type: "changeDate",
        date: data
      });
    }
  }
};
</script>
