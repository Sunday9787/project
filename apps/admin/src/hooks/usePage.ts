import { cloneDeep, debounce, type DebouncedFunc } from 'lodash-es'
import type { PaginationProps } from 'naive-ui'
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router'

import { wait } from '@/utils'

export interface PageContext<T = unknown> {
  pagination: PaginationProps
  table: Page.Table<T>
  form: Record<string, unknown>
  search: DebouncedFunc<(page?: number) => void>
}

function updateFields(this: Page.SearchFields, ignoreField: string[], form: Record<string, unknown>) {
  for (const [key, value] of Object.entries(form)) {
    if (ignoreField.some(ignoreField => ignoreField === key)) {
      continue
    }

    this[key] = value
  }
}

const defaultOption: Omit<Page.Options<AppRequest.List>, 'request' | 'form'> = {
  wait: 200,
  route: true,
  immediate: true,
  ignoreField: [],
  timeFieldMap: Object.create(null)
}

function pageHelpComputed<T>(context: PageContext<unknown>, fieldMap: Page.TimeFieldMap<T>) {
  const computedMap: { [key in Page.TimeMapField<T>]: Page.TimeMap } = Object.create(null)

  for (const [mapKey, value] of Object.entries(fieldMap)) {
    const [startTimeKey, endTimeKey] = value as [string, string]

    Object.defineProperty(computedMap, mapKey, {
      configurable: false,
      get() {
        if (context.form[startTimeKey]) {
          return [context.form[startTimeKey], context.form[endTimeKey]] as Page.TimeMap
        }

        return null
      },
      set(val: null | Page.TimeMap) {
        const [startTime, endTime] = val || [void 0, void 0]

        context.form[startTimeKey] = startTime
        context.form[endTimeKey] = endTime
      }
    })
  }

  return computedMap
}

function reset(this: PageContext, initialData: Record<string, unknown>) {
  for (const [key, value] of Object.entries(initialData)) {
    this.form[key] = value
  }

  this.search()
}

export function usePage<P extends AppRequest.List, K, R>(options: Page.Options<P, K, R>) {
  const opt = Object.assign({}, defaultOption, options) as Required<Page.Options<P, K, R>>
  const searchFields: Page.SearchFields = Object.create(null)
  const breakSearch = ref(false)
  const router = useRouter()
  const route = useRoute()

  const initialForm = cloneDeep(opt.form)

  const pagination: PaginationProps = shallowReactive({
    size: 'medium',
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 50],
    showSizePicker: true,
    showQuickJumper: true,
    onUpdatePage(page) {
      pagination.page = page
      search(page)
    },
    onUpdatePageSize(pageSize) {
      pagination.pageSize = pageSize
      console.log(Math.ceil(pagination.pageCount! / pageSize), pagination.page)
      /**
       * 当前总数 / 新分页条数 = 修改后最大页码
       * 如果小于 当前页码
       * 说明 当前页码需要更新为 修改后最大页码
       * 取消获取数据请求
       * 页码更新
       */
      if (Math.ceil(pagination.pageCount! / pageSize) < pagination.page!) return
      search(pagination.page)
    }
  })

  const table = reactive<Page.Table<R>>({
    loading: true,
    data: []
  })

  const search = debounce(function (current?: number) {
    if (typeof current === 'number') {
      const params: AppRequest.List = {
        current: pagination.page,
        size: pagination.pageSize
      }

      updateFields.apply(searchFields, [opt.ignoreField, opt.form])
      fetchData.apply(pageContext, [params])
      return
    }

    pagination.page = 1
    search(pagination.page)
  }, 300)

  const pageContext = { pagination, table, form: opt.form, search } as PageContext<R>

  const mapper = pageHelpComputed<K>(pageContext, opt.timeFieldMap)

  async function fetchData(this: PageContext<R>, params: AppRequest.List) {
    this.table.loading = true

    const query = Object.assign({}, params, searchFields)
    router.replace({ query: query as LocationQueryRaw })

    try {
      await wait(opt.wait)
      const response = await opt.request(query as P)
      this.table.data = response.list
      this.pagination.itemCount = response.total
    } finally {
      this.table.loading = false
    }
  }

  onBeforeMount(function () {
    for (const [key, value] of Object.entries(route.query)) {
      if (key === 'size') {
        pagination.pageSize = Number(value)
        continue
      }

      if (key === 'current') {
        pagination.page = Number(value)
        continue
      }

      searchFields[key] = value
      initialForm[key] = value
      opt.form[key] = /^\d+$/g.test(value as string) ? Number(value) : value
    }

    breakSearch.value = true
    search(pagination.page)
  })

  onMounted(function () {
    if (breakSearch.value) return
    if (opt.immediate) {
      search()
    }
  })

  provide('page', pageContext)

  return {
    reset: reset.bind(pageContext, initialForm),
    mapper,
    pagination,
    table,
    search
  }
}
