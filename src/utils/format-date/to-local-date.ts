/**
 * 将目标字符串或日期转为本地日期对象
 * @param date 目标字符串或日期
 */
export default function (date: string | number | Date): Date | null {
  if (date === '') {
    return null
  }

  if (date instanceof Date) {
    return date
  }

  let dateStr = date
  
  if (typeof dateStr === 'string') {
    dateStr = dateStr.replace(/-/g, '/')
    dateStr = dateStr.replace(/[Tt]/g, ' ')
    dateStr = dateStr.replace(/[Zz]/g, '')
    dateStr = dateStr.replace(/\..+/g, '')
  }

  const result = new Date(dateStr)

  if (result && result.getTime && result.getDate()) {
    return result
  } else {
    return null
  }
}
