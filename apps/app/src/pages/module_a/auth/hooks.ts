import { baseURL } from '@/utils/request'

export function useAuthCode() {
  const query = ref(Date.now().toString())

  const code = computed(function () {
    return baseURL('/auth/code?t=' + query.value)
  })

  function resetCode() {
    query.value = Date.now().toString()
  }

  return { code, resetCode }
}
