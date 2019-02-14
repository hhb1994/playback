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
        this.actionSuccess(`节目单查询日期已切换到: ${data}`);
        this.$store.commit({
          type: "changeDate",
          date: data
        });
      }
    }
  }
};
</script>
