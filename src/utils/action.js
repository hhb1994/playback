function actionSuccess(success) {
  this.$notify({
    title: "SUCCESS",
    message: success,
    type: "success",
    position: "top-left"
  });
}
function actionFailed(fail) {
  this.$notify.error({
    title: "FAILED",
    message: fail,
    duration: 10000,
    position: "top-left"
  });
}
function info(notice) {
  this.$notify.info({
    title: "通知",
    message: notice,
    duration: 0,
    position: "top-left"
  });
}

export { actionSuccess, actionFailed, info };
