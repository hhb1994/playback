<template>
  <div id="picker-container">
    <el-date-picker
      id="picker"
      v-model="date"
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
      date: "",
      currentDate: this.$moment().format("YYYY-MM-DD")
    };
  },
  methods: {
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
    date(data) {
      if (data > this.currentDate) {
        this.actionFailed(`节目单查询的日期不能超过 ${this.currentDate}`);
        this.date = "";
      } else {
        this.$store.commit({
          type: "changeDate",
          date: data
        });
      }
    }
  },
  mounted() {
    this.$store.commit({ type: "changeDate", date: this.currentDate });
  }
};
</script>
<style>
#picker-container {
  width: 210px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
}
#picker {
  border-radius: 20px;
  width: 190px;
}
#picker-container .el-input__inner {
  height: 33px;
}

#picker-container .el-input__prefix {
  height: 16px !important;
}
</style>
