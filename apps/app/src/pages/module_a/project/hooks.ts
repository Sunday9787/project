import { useLoading } from '@/hooks/useLoading'
import { ProjectEntity } from '@/service/project.entity'
import { useCacheModule } from '@/store/cache'

export interface Props {
  type?: Utils.ActionType
  id: string
}

export function useProject(props: Props) {
  const cacheModule = useCacheModule()
  const project = ref<ProjectEntity>(new ProjectEntity(props.id))

  const { loading, refresh } = useLoading(function (request) {
    if (props.type !== 'add') {
      request(async function () {
        project.value.detail().then(function (response) {
          project.value = response
        })
      })
    }
  })

  const members = customRef(function (track, trigger) {
    return {
      get() {
        track()
        return project.value.members.map(item => item.id)
      },
      set(value) {
        project.value.members = value.map(item => cacheModule.userMap.get(item)!)
        trigger()
      }
    }
  })

  return { project, loading, refresh, members }
}
