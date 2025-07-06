import dayjs from 'dayjs'

/**
 * 判断是否临近过期时间
 */
export function needRefreshToken(expireTime: number) {
  return dayjs().add(10, 'minute').isAfter(dayjs(expireTime))
}
