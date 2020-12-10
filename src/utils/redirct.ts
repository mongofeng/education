export function RedirectUrl (host: string, query?: string) {
  const appid = process.env.REACT_APP_APP_ID
  const state = query || 'query'
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${host}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
}