import { useLoading } from '@/hooks/useLoading'
import { ProjectEntity } from '@/service/project.entity'

export function useProject(props: Utils.ActionProps) {
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

  return { project, loading, refresh }
}
