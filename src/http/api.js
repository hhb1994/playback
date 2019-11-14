import { reqIp, timeTravelTp } from "./../config/config";
import { get, post } from "./http";
const req = {
  //验证下载权限
  verifyPermission: path => {
    return get(reqIp + "/token/" + path);
  },
  //请求直播时移
  getStream: params => {
    return get(timeTravelTp + "/GetM3U8", params);
  },
  //销毁直播时移的直播流
  destoryStream: params => {
    return get(timeTravelTp + "/CloseThread", params);
  },
  //登录操作
  login: body => {
    return post(reqIp + "/token", body);
  },
  //单点登录
  sso: body => {
    let path = body.token ? "/sso" : "sso2";
    return post(reqIp + path, body);
  },
  //获取频道列表
  getChannel: () => {
    return get(reqIp + "/channels");
  },
  //获取节目
  getProgram: path => {
    return get(reqIp + "/programs/", "", path);
  },
  //点击统计
  click: body => {
    return post(reqIp + "/click", body);
  }
};
export { req };
