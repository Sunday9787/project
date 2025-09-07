<template lang="pug">
.workbench-container
  .workbench-header
    n-card
      n-space
        n-button(type="primary" @click="add()") 随机添加一个
        n-button(type="primary" @click="adds()") 随机添加多个

  .workbench-content
    transition-group.job-container(tag="section")
      .job(v-for="job in jobList" :key="job.jobId" :class="{ move: job.isWorkMove }")
        .job-detail
          n-avatar
          h2 {{ job.name }}

        transition-group.job-todo-container.flex-1(name="todo" tag="ol")
          li.job-todo(v-for="todo in job.todoList" :key="todo.id")
            n-card(:title="todo.name" embedded)
              h2 {{ todo.name }}
              p {{ todo.desc }}
</template>

<script setup lang="ts">
import { plainToInstance } from 'class-transformer'

import { Job, Todo, useWorkbench } from './hooks'

defineOptions({ name: 'PageWorkbench' })

function getRandomIndex<T>(arr: T[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('需要传入一个非空数组')
  }
  return Math.floor(Math.random() * arr.length)
}

/**
 * 寻找数组差异
 */
function diffArrays<T extends object, K extends keyof T>(oldArr: T[], newArr: T[], key: K) {
  const oldArrIds = oldArr.map(item => item[key])
  const newArrIds = newArr.map(item => item[key])

  const added = newArr.filter(item => !oldArrIds.includes(item[key]))
  const removed = oldArr.filter(item => !newArrIds.includes(item[key]))
  const unchanged = newArr.filter(item => oldArrIds.includes(item[key]))

  return { added, removed, unchanged }
}

const { jobList } = useWorkbench()
const index = ref([1, 2, 3])

function add() {
  const i = getRandomIndex(index.value)
  const id = ++index.value[i]

  jobList.value[i].todoList.unshift({
    id,
    name: '牛魔王',
    desc: '不通过'
  })
}

function adds() {
  const data: Job[] = plainToInstance(Job, [
    {
      jobId: 1,
      name: '前端开发工程师',
      desc: '测试',
      todoList: [
        {
          id: 1,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 2,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 3,
          name: '机车靓仔',
          desc: '合适'
        },

        {
          id: 4,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 5,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 6,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 7,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 8,
          name: '机车靓仔',
          desc: '合适'
        },
        {
          id: 9,
          name: '机车靓仔',
          desc: '合适'
        }
      ]
    },
    { exposeDefaultValues: true }
  ])

  const diff = diffArrays(jobList.value, data, 'jobId')
  const jobMap = new Map(jobList.value.map(item => [item.jobId, item]))
  const unchangedJobMap = new Map(diff.unchanged.map(item => [item.jobId, item]))

  for (const [key, newJob] of unchangedJobMap) {
    const job = jobMap.get(key)!
    const diffTodo = diffArrays(job.todoList, newJob.todoList, 'id')

    /**
     * 新增的 todo
     */
    if (diffTodo.added.length) {
      /**
       * 开启传送带动画
       */
      job.isWorkMove = true
      window.clearTimeout(job.totoTimer)
      enPushQueue(job, diffTodo.added)
    }
  }
}

/**
 * 队列
 */
function enPushQueue(context: Job, data: Todo[], index = 0, interval = 600) {
  context.totoTimer = window.setTimeout(
    function () {
      /**
       * 队列执行完毕后 关闭 传送带动画
       */
      if (index > data.length - 1) {
        context.isWorkMove = false
        return
      }

      context.todoList.unshift(data[index])
      enPushQueue(context, data, index + 1, interval)
    },
    index === 0 ? 0 : interval
  )
}
</script>

<style lang="less">
@offset: 100px;

@keyframes move-background {
  0% {
    /* 起始位置 */
    background-position-x: 0;
  }

  100% {
    background-position-x: 80px;
  }
}

.workbench-container {
  height: inherit;
  background-color: var(--color-background);
}

.workbench-header {
  margin-bottom: 60px;
}

.workbench-content {
  margin: 20px;
}

.job-container {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}

.job {
  display: flex;
  column-gap: 12px;
  margin: 0;
  overflow: hidden;
  list-style: none;
  background-color: var(--color-primary);
  background-image: url('/image/roud-line.png'), linear-gradient(180deg, #eff5ff 0%, #c8dbff 100%);
  background-repeat: repeat-x;
  background-position: 0 50%;
  animation: move-background 0.4s linear infinite forwards;
  animation-play-state: paused;

  &.move {
    animation-play-state: running;
  }
}

.job-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  padding: 12px;
  background-color: #fff;
}

.job-todo-container {
  display: flex;
  column-gap: 12px;
  overflow-x: auto;
}

.job-todo {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  width: 200px;
}

/* 进入（掉落动画） */
.todo-enter-from {
  opacity: 0;
  transform: translateY(-@offset) scale(0.6);
}

.todo-enter-active {
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.todo-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 离开动画 */
.todo-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.todo-leave-active {
  position: absolute;

  /* 避免塌陷 */
  transition: all 0.4s ease;
}

.todo-leave-to {
  opacity: 0;
  transform: translateY(@offset) scale(0.6);
}

/* 列表元素位置变化的动画 */
.todo-move {
  transition: transform 0.5s ease;
}
</style>
