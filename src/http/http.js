import axios from "axios";


axios.defaults.timeout = 10000;


// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.headers['content-type'] = "application/json";
    if (sessionStorage.token) {
      config.headers["Authorization"] = sessionStorage.token;
    }

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  res => {
    return Promise.resolve(res.data);
   
  },
  err => {
    // Notification.error({ title: "error", message: err });
    return Promise.reject(err);
  }
);

function get(url, params = "", path = "") {
  return new Promise((resolve, reject) => {
    axios
      .get(url + path, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
function post(url, body = "", path = "") {
  return new Promise((resolve, reject) => {
    axios
      .post(url + path, body)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export { get, post };
