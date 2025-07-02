import { useLoading } from '@repo/service'

import { ProjectEntity } from '@/service/project.entity'

export function useProject(data: Utils.ActionProps) {
  const entity = ref(new ProjectEntity(data.id))
  const { loading } = useLoading(function (request) {
    if (data.type !== 'add') {
      request(async function () {
        entity.value = await entity.value.data()
      })
    }
  })

  return { entity, loading }
}
