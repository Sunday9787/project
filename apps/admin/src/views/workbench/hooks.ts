import { plainToInstance, Type } from 'class-transformer'
import Mock from 'mockjs'

export function getRandomNumberByLength(length: number) {
  if (length <= 0) {
    throw new Error('长度必须大于 0')
  }
  return Math.floor(Math.random() * length)
}

export class Job {
  jobId: number
  name: string
  desc: string
  isWorkMove = false
  totoTimer: number = -1

  @Type(() => Todo)
  todoList: Todo[]
}

export class Todo {
  id: number
  name: string
  desc: string
}

export function mockData() {
  return Mock.mock({
    data: [
      {
        id: 1,
        name: '前端开发工程师',
        todoList: [
          {
            id: '@id+',
            name: ''
          }
        ]
      },
      {
        id: 2,
        name: '测试开发工程师',
        todoList: [
          {
            id: '@id+',
            name: ''
          }
        ]
      },
      {
        id: 3,
        name: '后端开发工程师',
        todoList: [
          {
            id: '@id+',
            name: ''
          }
        ]
      }
    ]
  })
}

function initData() {
  return [
    {
      jobId: 1,
      name: '前端开发工程师',
      todoList: [
        {
          id: 1,
          name: '机车靓仔',
          desc: '合适'
        }
      ]
    },
    {
      jobId: 2,
      name: '测试开发工程师',
      todoList: [
        {
          id: 1,
          name: '机车靓仔',
          desc: '通过'
        },
        {
          id: 2,
          name: '至尊宝',
          desc: '通过'
        }
      ]
    },
    {
      jobId: 3,
      name: '后端开发工程师',
      todoList: [
        {
          id: 1,
          name: '机车靓仔',
          desc: '面试'
        },
        {
          id: 2,
          name: '紫霞仙子',
          desc: '通过'
        },
        {
          id: 3,
          name: '牛魔王',
          desc: '不通过'
        }
      ]
    }
  ] as Job[]
}

function request<T = unknown>(data: T, sleep = 2000): Promise<T> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(data)
    }, sleep)
  })
}

export function useWorkbench(): { jobList: Ref<Job[]> } {
  const jobList = ref<Job[]>([])

  request(initData(), 200).then(function (response) {
    jobList.value = plainToInstance(Job, response, { exposeDefaultValues: true })
  })

  return {
    jobList
  }
}
