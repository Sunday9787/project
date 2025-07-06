import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function formatDate(date: Date | string | number | null, format = 'YYYY-MM-DD') {
  if (date) return dayjs.utc(date).local().format(format)
}

export async function bootstrapRequest<T>(value: Ref<T>, Result: Promise<T>) {
  value.value = await Result
}

export function getGlobalThis(): Window & typeof globalThis {
  // 兜底，使用 Function 构造器执行非严格模式的 this
  return Function('return this')()
}
