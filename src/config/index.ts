import { COURSE_HOUR_ACTION_TYPE } from '../const/enum'

// export const isDev: boolean = process.env.NODE_ENV === 'development';

export const isDev: boolean = false;
export const sign:string = 'yMWwcsc25qNY-24GYSD_KTvVbFIQFPLZuzzP_YyXTgM' // 签到提醒
export const packageBuy:string = 'qcf3mZG_XkEwkVYuV4IKk53H44tcyU70kW9xsnn24lM' // 添加课程包
export const supplement:string = 'AQnWg1pIJRJvhD4p1HmCLluQn0EFHwLAGHDubmyWN1g' // 补签


export const templateIds: Map<COURSE_HOUR_ACTION_TYPE, string> = new Map([
  [COURSE_HOUR_ACTION_TYPE.buy, packageBuy],
  [COURSE_HOUR_ACTION_TYPE.supplement, supplement],
  [COURSE_HOUR_ACTION_TYPE.sign, sign],
])
