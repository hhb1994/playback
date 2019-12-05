import videojs from "video.js";

class ControlBtn extends videojs.getComponent("Button") {
  constructor(player, options = {}) {
    super(player, options);
    this.name_ = "ControlBtn";
    this.addClass("vjs-play-control");
    this.el().innerHTML = "高清";
    // this.on(player, "ready", this.handleReady);
    // this.on(player, "play", this.handlePlay);
    // this.on(player, "pause", this.handlePaused);
    this.on(this.el(), ["click", "tap"], this.handleControlClick);
  }
  handlePlay() {
    this.removeClass("vjs-paused");
    this.addClass("vjs-playing");
    this.controlText("Pause");
  }
  handlePaused() {
    this.removeClass("vjs-playing");
    this.addClass("vjs-paused");
    this.controlText("Play");
  }
  handleControlClick() {
    if (this.options_.sources.length == 2) {
      this.el().innerHTML = this.el().innerHTML == "高清" ? "标清" : "高清";
      this.player_.src(this.options_.sources.reverse());
    }

    // this.player_.paused() ? this.player_.play() : this.player_.pause();
  }
  handleReady(e) {
    console.log(this.player_.options_);
    console.log(this.options_);
    // this.player_.paused() ? this.player_.play() : this.player_.pause();
  }
}
export { ControlBtn };
