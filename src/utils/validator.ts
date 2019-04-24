export const phone = (rule: any, value: any, callback: (params?: Error) => void) => {
    if (value && !/^(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[579])[0-9]{8}$/.test(value)) {
      callback(new Error('手机号码不合法, 请重新输入'))
    } else {
      callback()
    }
  }