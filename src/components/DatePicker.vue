<template>
  <div id="picker-container">
    <el-date-picker
      id="picker"
      v-model="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      :clearable="false"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  name: "DatePicker",
  data() {
    return {
      date: "",
      currentDate: this.$moment().format("YYYY-MM-DD")
    };
  },
  watch: {
    date(data) {
      if (data > this.currentDate) {
        this.$actionFailed(`节目单查询的日期不能超过 ${this.currentDate}`);
        this.date = "";
      } else if (data) {
        this.$store.commit({
          type: "changeDate",
          date: data
        });
      }
    }
  }
};
</script>
<style>
#picker-container {
  width: 185px;
  padding-top: 10px;
  padding-bottom: 10px;
  
  padding-right: 15px;
  background-color: black;
  border-top-right-radius: 25px;
}
#picker {
  border-radius: 20px;
  width: 190px;
}
#picker-container .el-input__inner {
  height: 33px;
  background-color: rgb(31, 31, 31);
  color: white;
  border: none;
}

#picker-container .el-input__prefix {
  height: 16px !important;
}
</style>
