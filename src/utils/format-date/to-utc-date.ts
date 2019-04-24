import toLocalDate from './to-local-date'

/**
 * 将目标字符串转为UTC格式日期对象
 * @param date 表示UTC时间的字符串
 */
export default function (date: string | number | Date): Date | null {
  const localDate = toLocalDate(date)
  const SECONDS_PER_MINUTE = 60

  if (!localDate) { return localDate }

  const offset = (new Date()).getTimezoneOffset()

  return new Date(localDate.getTime() + offset * SECONDS_PER_MINUTE * 1000)
}
