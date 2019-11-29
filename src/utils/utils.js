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
    a.target = "_Blank";
    a.download = "";
    a.click();
    document.body.removeChild(a);
  },
  getExplore(agent) {
    var Sys = {};
    var ua = agent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/))
      ? (Sys.ie = s[1])
      : (s = ua.match(/msie ([\d\.]+)/))
      ? (Sys.ie = s[1])
      : (s = ua.match(/edge\/([\d\.]+)/))
      ? (Sys.edge = s[1])
      : (s = ua.match(/firefox\/([\d\.]+)/))
      ? (Sys.firefox = s[1])
      : (s = ua.match(/(?:opera|opr).([\d\.]+)/))
      ? (Sys.opera = s[1])
      : (s = ua.match(/chrome\/([\d\.]+)/))
      ? (Sys.chrome = s[1])
      : (s = ua.match(/version\/([\d\.]+).*safari/))
      ? (Sys.safari = s[1])
      : 0;
    // 根据关系进行判断
    if (Sys.ie) return "IE";
    if (Sys.edge) return "EDGE: " + Sys.edge;
    if (Sys.firefox) return "Firefox: " + Sys.firefox;
    if (Sys.chrome) return "Chrome: " + Sys.chrome;
    if (Sys.opera) return "Opera: " + Sys.opera;
    if (Sys.safari) return "Safari: " + Sys.safari;
    return "Unkonwn";
  }
};
