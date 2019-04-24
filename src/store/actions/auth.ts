/**
 * 登录
 */
export const LOGIN_REQUSET_ING: string = 'LOGIN_REQUSET_ING' // 登录请求
export const LOGIN_STATUS: string = 'LOGIN_STATUS'
export const LOADING: string = 'LOADING'


/**
 * 注册
 */
export const REGISTER_REQUSET_ING: string = 'REGISTER_REQUSET_ING'
export const REGISTER_STATUS: string = 'REGISTER_STATUS'

// 请求中
export const Loading = (loading: boolean) => ({
  type: LOADING,
  loading
})

// 登录请求
export const Loginrequest = (params: any) => ({
  type: LOGIN_REQUSET_ING,
  params
})


// 登录成功还是失败
export const LoginStatus  = (isSuccess: boolean) => (
  {
    type: LOGIN_STATUS,
    isSuccess
  }
)


// 登录请求
export const RegisterRequest = (params: any) => ({
  type: REGISTER_REQUSET_ING,
  params
})


// 登录成功还是失败
export const RegisterStatus  = (data: any, isSuccess: boolean) => (
  {
    type: REGISTER_STATUS,
    params: {
      data,
      isSuccess
    }
  }
)
