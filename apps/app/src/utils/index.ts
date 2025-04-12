import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function formatDate(date: Date | string | number | null, format = 'YYYY-MM-DD') {
  if (date) return dayjs.utc(date).local().format(format)
}

export async function bootstrapRequest<T>(value: Ref<T>, Result: Promise<T>) {
  value.value = await Result
}
