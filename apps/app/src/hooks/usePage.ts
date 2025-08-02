import { AbstractEntity } from '@repo/service'
import { debounce, type DebouncedFunc } from 'lodash-es'

interface PageOption<F = unknown, P = unknown, R = unknown> {
  form: F
  immediate?: boolean
  pagination?: AppUsePage.Pagination
  request(param: P): Promise<AppResponse.List<R>>
}

export interface PageInst<R = unknown> {
  isFinish: Ref<boolean>
  isTriggered: Ref<boolean>
  table: AppUsePage.Table<R>
  pagination: AppUsePage.Pagination
  search: DebouncedFunc<(page?: number) => void>
  onRefresh(): void
  onLoadMore(): void
}

export const PageInstKey = Symbol('PageInst')

const defaultOption: Partial<PageOption> = {
  immediate: true,
  pagination: {
    layout: '',
    total: 0,
    current: 1,
    limit: 10
  }
}

function updateFields(this: Record<string, unknown>, form: object) {
  for (const [key, value] of Object.entries(AbstractEntity.toJSON(form))) {
    this[key] = value
  }
}

function sleep(time = 1000) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

export function usePage<F extends object, P extends AppRequest.List, R>(option: PageOption<F, P, R>) {
  const opt: Required<PageOption<F, P, R>> = Object.assign(Object.create(null), defaultOption, option)
  const pagination = reactive(opt.pagination)
  const table = reactive({})
  const searchFields: Record<string, unknown> = Object.create(null)
  /**
   * 当前下拉刷新状态
   */
  const isTriggered = ref(false)
  /**
   * 是否已到底
   */
  const isFinish = ref(false)

  const search = debounce(function (page?: number) {
    if (page) {
      const param: Required<P> = Object.assign(Object.create(null), searchFields, pagination)
      data.call(inst, param)
      return
    }

    if (pagination.current === 1) {
      search(pagination.current)
      return
    }

    updateFields.call(searchFields, opt.form)
    pagination.current = 1
  })

  async function data(this: PageInst<R>, param: Required<P>) {
    uni.showLoading({
      title: '加载中...'
    })

    await sleep()

    try {
      this.table.loading = true
      const response = await opt.request(param)
      this.pagination.total = response.total
      this.table.data = param.current === 1 ? response.list : this.table.data.concat(response.list)
      isFinish.value = param.current! > 1 && this.pagination.current * this.pagination.limit > this.pagination.total
    } finally {
      this.table.loading = false
      isTriggered.value = false
      uni.hideLoading()
    }
  }

  function onRefresh() {
    console.log('onRefresh')
    isTriggered.value = true
    search()
  }

  function onLoadMore() {
    console.log('onLoadMore')
    if (isFinish.value) {
      isTriggered.value = false
      console.log('已经到底了')
      return
    }

    pagination.current += 1
  }

  const inst = {
    isFinish,
    isTriggered,
    onRefresh,
    onLoadMore,
    search,
    table,
    pagination
  } as PageInst<R>

  provide(PageInstKey, inst)
  watch(() => pagination.current, search, { immediate: opt.immediate })

  return inst
}
