import { onLoad } from '@dcloudio/uni-app'

import { ProjectEntity } from '@/service/project.entity'

export function useProject(props: Utils.ActionProps) {
  const project = ref<ProjectEntity>(new ProjectEntity(props.id))

  onLoad(function () {
    if (props.type !== 'add') {
      project.value.detail().then(function (response) {
        project.value = response
      })
    }
  })

  return project
}
