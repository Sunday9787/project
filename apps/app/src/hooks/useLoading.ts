type UseActionRequest = () => Promise<void>
type UseActionHandle = (request: UseActionRequest) => void
type UseActionCallback = (handle: UseActionHandle) => void

export function useLoading(cb: UseActionCallback) {
  const loading = ref(false)

  function init(refresh = false) {
    cb(function (request) {
      loading.value = true
      request().finally(function () {
        setTimeout(
          function () {
            loading.value = false
          },
          refresh ? 0 : 400
        )
      })
    })
  }

  function refresh() {
    init(true)
  }

  init()

  return { loading, init, refresh }
}
