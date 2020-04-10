/*
 * @Author: 韩宏斌
 * @Description: this is the description
 * @version: 1.0.0
 * @LastEditors: 韩宏斌
 * @Date: 2019-03-26 15:42:58
 * @LastEditTime: 2020-04-03 13:30:42
 * @FilePath: /playback/vue.config.js
 */
module.exports = {
  publicPath: "./",
  chainWebpack: config => {
    config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
  }
};
