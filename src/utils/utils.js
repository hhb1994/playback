export default {
  getUrlKey: function(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  },
  downloadFile(url) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.target = "_Blank"
    a.download = "";
    a.click();
    document.body.removeChild(a);
  }
};
