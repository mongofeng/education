import { IUserInfo } from '@/const/type/wechat';
import * as apiWechat from '@/api/wechat'
import * as React from "react";



export default function wechatHook () {




  const [wechat, setWechat] = React.useState({} as {[key in string]: string});



  const fetchUserInfo = async (ids: string[]) => {
    

    const resetIds = ids.filter(i => !wechat[i]) 
    if (!resetIds.length) {
      return
    }

    const PromiseApi = resetIds.map(openid => {
      return apiWechat.fetchUserInfo({
        openid,
      });
    })
    const res = await Promise.all(PromiseApi)

    const result = res.reduce((initVal: {[key in string]: string}, item, index) => {
      if (item.data && item.data.nickname) {
        initVal[item.data.openid] = item.data.nickname
      } else if (item.data) { // 兼容java的接口
         const data: IUserInfo =  (item.data as any).data 
         console.error(data)
         if (data.nickname && data.openid) {
           initVal[data.openid] = data.nickname
         }
      }
      return initVal
    }, {})

    setWechat({
      ... wechat,
      ...result
    })
  }



  return {
    wechat,
    fetchUserInfo,
  }
}