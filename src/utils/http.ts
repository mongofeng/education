import { notification } from "antd";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {throttle} from './util'

export const accessTokenName = "Authorization";

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };



const notice = throttle(() => {
  notification.error({
    message: `token失效`,
    description: "请重新登录页面"
  });
  window.location.href = process.env.REACT_APP_PUBLIC_UR
}, 10000)

function interceptors (http: AxiosInstance) {
  http.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      const response = error.response
      console.log(response)
      console.log(response.data)
      if (response.status === 403) { // token失效
        notice()
      } else {
        let description = '请求错误'
        if (typeof response.data === 'string') {
          description = response.data
        } else if (typeof response.data === 'object') {
          // {"msg":"课程包为空","code":null}
          // {"timestamp":"2020-12-14T06:10:09.240+0000","status":500,"error":"Internal Server Error","message":"No message available","path":"/trial-course-record/supplement"}
          const {
            message,
            err: errMsg,
            error: err,
            msg,
          } = response.data

          description = message || (errMsg && errMsg.desc) || err ||  msg || '未知请求错误'
        }

        notification.error({
          message: `请求错误`,
          description
        });
      }

      return Promise.reject(error);
    }
  );

  http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const localStorageAccessTokenName = window.localStorage.getItem(
        accessTokenName
      );
      if (localStorageAccessTokenName) {
        config.headers[accessTokenName] = localStorageAccessTokenName;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
}


function createHttp (baseURL: string): AxiosInstance {
  const http = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
  interceptors(http)
  return http
}



export default createHttp(process.env.REACT_APP_API_DEFAULT);

export const wechat = createHttp(process.env.REACT_APP_API_WECHAT);
