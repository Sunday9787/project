import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function formatDate(date: Date | string | number | null, format = 'YYYY-MM-DD HH:mm:ss') {
  if (date) return dayjs.utc(date).local().format(format)
}

export function wait(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function resourceURL(url?: string | null) {
  if (url) {
    return import.meta.env.VITE_APP_RESOURCE_DOMAIN + url
  }
}

export function urlResource(url: string) {
  return url.replace(import.meta.env.VITE_APP_RESOURCE_DOMAIN, '')
}

export function isIntegerString(val: string) {
  return /^\d+$/g.test(val)
}
