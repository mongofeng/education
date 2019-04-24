import toLocalDate from './to-local-date'
import toUTCDate from './to-utc-date'

/**
 * 日期格式化，返回本地时间
 * @param dateStr 目标日期字符串
 * @param format 日期输出格式
 * @param isUTC 是否以UTC时间解析日期字符串,默认为否
 */
function formatDate (
  dateStr: string | number | Date,
  {
    format = 'yyyy-MM-dd hh:mm:ss',
    isUTC = false,
  } = {},
): string {
  if (!dateStr) { return '-' }
  let date
  if (isUTC) {
    date = toUTCDate(dateStr)
  } else {
    date = toLocalDate(dateStr)
  }

  // dateStr 参数不合法（不能转为Date类型）
  if (!date) {
    return '-'
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  const zeroPrefix = (num: number, digits = 2) => `0${num}`.slice(-digits)

  return format
    .replace(/yyyy/g, `${year}`)
    .replace(/MM/g, zeroPrefix(month))
    .replace(/dd/g, zeroPrefix(day))
    .replace(/yy/g, `${year}`)
    .replace(/d/g, `${day}`)
    .replace(/hh/g, zeroPrefix(hours))
    .replace(/mm/g, zeroPrefix(minutes))
    .replace(/ss/g, zeroPrefix(seconds))
    .replace(/SSS/g, `${milliseconds}`.slice(0, 3))
}

export default formatDate
