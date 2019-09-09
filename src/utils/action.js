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
    position: "top-left"
  });
}

export { actionSuccess, actionFailed };
