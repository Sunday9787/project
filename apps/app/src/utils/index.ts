import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function formatDate(date: Date | string | number | null, format = 'YYYY-MM-DD HH:mm:ss') {
  if (date) return dayjs.utc(date).local().format(format)
}
